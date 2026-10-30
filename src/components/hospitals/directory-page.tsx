import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronRight, Construction, List, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DEFAULT_FILTERS,
  MOCK_HOSPITALS,
  PAGE_SIZE,
  countActiveFilters,
  filterHospitals,
  filtersFromSearch,
  filtersToSearch,
  sortHospitals,
  type DirectoryFilters,
  type Hospital,
  type SortOption,
} from "@/data/hospitals";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/home/coming-soon";
import { routes } from "@/config/navigation";
import { FilterFields } from "./filter-panel";
import { HospitalCard } from "./hospital-card";
import { HospitalMapView } from "./map-view";
import { DirectoryEmptyState, DirectoryErrorState, DirectoryLoadingState } from "./directory-states";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "city-asc", label: "City A–Z" },
];

function ViewToggle({ view, onChange }: { view: "list" | "map"; onChange: (v: "list" | "map") => void }) {
  return (
    <div className="flex rounded-full border border-border bg-muted p-1" role="group" aria-label="Results view">
      {(
        [
          { value: "list", label: "List", icon: List },
          { value: "map", label: "Map", icon: MapIcon },
        ] as const
      ).map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={view === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
            view === o.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <o.icon className="h-4 w-4" aria-hidden /> {o.label}
        </button>
      ))}
    </div>
  );
}

export function HospitalDirectoryPage() {
  const search = useSearch({ from: "/hospitals" });
  const navigate = useNavigate({ from: "/hospitals" });

  const searchKey = JSON.stringify(search);
  const filters = useMemo(() => filtersFromSearch(search), [searchKey]);

  const [view, setView] = useState<"list" | "map">("list");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [details, setDetails] = useState<Hospital | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<DirectoryFilters>(DEFAULT_FILTERS);
  // Development-only preview of the loading/error component states.
  const [preview, setPreview] = useState<"loading" | "error" | null>(null);

  const apply = (next: DirectoryFilters, opts?: { replace?: boolean }) =>
    navigate({ search: filtersToSearch(next), replace: opts?.replace ?? false });

  // Name search: local draft debounced into the URL (replace, not push).
  const [qDraft, setQDraft] = useState(filters.q);
  useEffect(() => setQDraft(filters.q), [filters.q]);
  useEffect(() => {
    if (qDraft === filters.q) return;
    const t = setTimeout(() => apply({ ...filters, q: qDraft }, { replace: true }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDraft]);

  // Reset pagination whenever filters or sorting change.
  useEffect(() => setVisible(PAGE_SIZE), [searchKey, sort]);

  const filtered = useMemo(
    () => sortHospitals(filterHospitals(MOCK_HOSPITALS, filters), sort),
    [filters, sort],
  );
  const shown = filtered.slice(0, visible);
  const activeCount = countActiveFilters(filters);

  const chips: { key: keyof DirectoryFilters; label: string; clear: () => void }[] = [
    ...(filters.city ? [{ key: "city" as const, label: filters.city, clear: () => apply({ ...filters, city: "" }) }] : []),
    ...(filters.type !== "all"
      ? [{ key: "type" as const, label: filters.type === "public" ? "Public" : "Private", clear: () => apply({ ...filters, type: "all" }) }]
      : []),
    ...(filters.department ? [{ key: "department" as const, label: filters.department, clear: () => apply({ ...filters, department: "" }) }] : []),
    ...(filters.q.trim() ? [{ key: "q" as const, label: `"${filters.q.trim()}"`, clear: () => apply({ ...filters, q: "" }) }] : []),
  ];

  const openDrawer = () => {
    setDraft(filters);
    setDrawerOpen(true);
  };

  return (
    <main>
      {/* Section 02 — Directory introduction */}
      <section className="bg-sky">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <NavLink target={routes.home} className="font-medium text-primary hover:underline" />
            <ChevronRight className="h-4 w-4" aria-hidden />
            <span aria-current="page" className="text-foreground">
              Find Hospitals
            </span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Find a Hospital</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore participating hospitals and healthcare services across Ethiopia.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Demonstration directory — hospital listings and locations are fictional.
          </p>
        </div>
      </section>

      {/* Sections 03–05 — filter workspace and results */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        {/* Desktop filter sidebar */}
        <aside aria-label="Hospital filters" className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy">Filters</h2>
              <button
                type="button"
                onClick={() => apply(DEFAULT_FILTERS)}
                disabled={activeCount === 0}
                className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
              >
                Clear All
              </button>
            </div>
            <FilterFields
              idPrefix="side"
              value={{ ...filters, q: qDraft }}
              onChange={(next) => {
                if (next.q !== filters.q) setQDraft(next.q);
                else apply({ ...next, q: filters.q });
              }}
            />
          </div>
        </aside>

        {/* Results area */}
        <section aria-label="Hospital results" className="min-w-0">
          {/* Mobile search + filter trigger */}
          <div className="flex flex-col gap-3 lg:hidden">
            <FilterFields
              idPrefix="top"
              value={{ ...DEFAULT_FILTERS, q: qDraft }}
              onChange={(next) => setQDraft(next.q)}
            />
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" className="h-11 border-primary text-primary hover:bg-accent hover:text-primary" onClick={openDrawer}>
                <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
                {activeCount > 0 && (
                  <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          {/* Results toolbar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 lg:mt-0">
            <p aria-live="polite" className="text-sm font-medium text-muted-foreground">
              {filtered.length} sample {filtered.length === 1 ? "hospital" : "hospitals"} found
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm text-muted-foreground">
                  Sort
                </Label>
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger id="sort" className="h-10 w-[140px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden lg:block">
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.key} className="flex items-center gap-1 rounded-full bg-accent py-1 pl-3 pr-1 text-sm text-primary">
                  {c.label}
                  <button
                    type="button"
                    onClick={c.clear}
                    aria-label={`Remove filter ${c.label}`}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-background"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => apply(DEFAULT_FILTERS)} className="px-2 text-sm font-medium text-primary hover:underline">
                  Clear All
                </button>
              </li>
            </ul>
          )}

          {/* Results */}
          <div className="mt-5">
            {preview === "loading" ? (
              <DirectoryLoadingState />
            ) : preview === "error" ? (
              <DirectoryErrorState onRetry={() => setPreview(null)} />
            ) : filtered.length === 0 ? (
              <DirectoryEmptyState onClear={() => apply(DEFAULT_FILTERS)} />
            ) : view === "map" ? (
              <HospitalMapView hospitals={filtered} onViewDetails={setDetails} />
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {shown.map((h) => (
                    <HospitalCard key={h.id} hospital={h} onViewDetails={setDetails} />
                  ))}
                </div>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground" aria-live="polite">
                    Showing {shown.length} of {filtered.length} sample hospitals
                  </p>
                  {visible < filtered.length ? (
                    <Button variant="outline" className="h-11 border-primary px-8 text-primary hover:bg-accent hover:text-primary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Load More Hospitals
                    </Button>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">All matching sample hospitals are shown.</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Development-only preview of the loading/error states. */}
          {import.meta.env.DEV && (
            <div className="mt-10 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              <span className="font-semibold">Developer preview:</span>
              <button type="button" className="rounded-full border border-border px-3 py-1 hover:bg-accent" onClick={() => setPreview("loading")}>
                Loading state
              </button>
              <button type="button" className="rounded-full border border-border px-3 py-1 hover:bg-accent" onClick={() => setPreview("error")}>
                Error state
              </button>
              {preview && (
                <button type="button" className="rounded-full border border-border px-3 py-1 hover:bg-accent" onClick={() => setPreview(null)}>
                  Back to results
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer — draft values, Apply commits, closing discards. */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="flex w-80 max-w-[85vw] flex-col">
          <SheetHeader>
            <SheetTitle className="text-left">Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <FilterFields idPrefix="drawer" value={draft} onChange={setDraft} />
          </div>
          <SheetFooter className="flex-col gap-2 border-t border-border pt-4">
            <Button variant="ghost" className="h-11" onClick={() => setDraft(DEFAULT_FILTERS)}>
              Clear All
            </Button>
            <Button
              className="h-11"
              onClick={() => {
                apply(draft);
                setDrawerOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Details — Screen 06 notice */}
      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
              <Construction className="h-5 w-5" aria-hidden />
            </div>
            <DialogTitle>{details?.name}</DialogTitle>
            <DialogDescription>
              Hospital details will be available in the next design phase. This is a fictional demonstration listing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDetails(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
