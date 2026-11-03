// P-02 My Appointments list. Filters live in the URL (fictional, non-sensitive
// values only); appointment data comes from the shared in-memory provider.
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  ChevronRight,
  Clock,
  Info,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIRECTORY_DEFAULTS } from "@/data/directory-search";
import {
  EMPTY_FILTERS,
  PAGE_SIZE,
  RANGE_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  activeFilterCount,
  appointmentCounts,
  compatibleFilters,
  dateRangeError,
  effectiveSort,
  filterAppointments,
  managementEligibility,
  patientHospitals,
  type AppointmentFilters,
  type AppointmentTab,
  type AppointmentsSearch,
} from "@/data/patient-appointments";
import { formatDate, formatTime, type Appointment } from "@/data/patient-demo";
import { cn } from "@/lib/utils";
import { usePatientAppointments } from "./appointments-provider";
import { CancelAppointmentDialog, RescheduleAppointmentDialog } from "./appointment-dialogs";
import { StatusBadge } from "./status-badge";

const RESULTS_HEADING_ID = "appointment-results-heading";

const pickFilters = (s: AppointmentsSearch): AppointmentFilters => ({
  q: s.q,
  status: s.status,
  hospital: s.hospital,
  range: s.range,
  from: s.from,
  to: s.to,
  sort: s.sort,
});

export function PatientAppointmentsPage() {
  const search = useSearch({ from: "/patient/appointments/" });
  const navigate = useNavigate({ from: "/patient/appointments/" });
  const { appointments, now } = usePatientAppointments();
  const tab = search.tab;
  const filters = compatibleFilters(pickFilters(search), tab);

  const setSearch = (patch: Partial<AppointmentsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const setTab = (next: AppointmentTab) => {
    // Keep compatible criteria; tab-specific status/range and sort fall back to defaults.
    const kept = compatibleFilters(filters, next);
    setSearch({ ...kept, tab: next, sort: SORT_OPTIONS.some((o) => o.value === filters.sort) && filters.sort !== "date-asc" && filters.sort !== "date-desc" ? filters.sort : "" });
  };

  return (
    <div className="space-y-5">
      <PageHeader />
      {!appointments || !now ? (
        <div className="space-y-4" aria-hidden>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-12" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <AppointmentsBody appointments={appointments} now={now} tab={tab} filters={filters} search={search} setSearch={setSearch} setTab={setTab} />
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <section
      aria-labelledby="appointments-heading"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-r from-card via-accent to-teal-soft p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-teal shadow-card sm:h-14 sm:w-14">
          <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
        <div>
          <h1 id="appointments-heading" tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-navy focus:outline-none sm:text-3xl">
            My Appointments
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">View and manage your hospital appointments.</p>
        </div>
      </div>
      <Button asChild variant="teal" size="lg" className="h-11 w-full px-5 sm:w-auto">
        <Link to="/hospitals" search={DIRECTORY_DEFAULTS}>
          <CalendarPlus className="h-5 w-5" aria-hidden /> Book Appointment
        </Link>
      </Button>
    </section>
  );
}

function AppointmentsBody({
  appointments,
  now,
  tab,
  filters,
  search,
  setSearch,
  setTab,
}: {
  appointments: Appointment[];
  now: Date;
  tab: AppointmentTab;
  filters: AppointmentFilters;
  search: AppointmentsSearch;
  setSearch: (p: Partial<AppointmentsSearch>) => void;
  setTab: (t: AppointmentTab) => void;
}) {
  const counts = appointmentCounts(appointments, now);
  const hospitals = useMemo(() => patientHospitals(appointments), [appointments]);
  const results = filterAppointments(appointments, tab, filters, now);
  const filtered = activeFilterCount(filters) > 0;
  const tabTotal = tab === "upcoming" ? counts.upcoming : counts.past;

  // Load More resets whenever the tab, filters or sort change.
  const pageKey = JSON.stringify({ tab, filters });
  const [page, setPage] = useState({ key: pageKey, n: PAGE_SIZE });
  const visibleCount = page.key === pageKey ? page.n : PAGE_SIZE;
  const visible = results.slice(0, visibleCount);

  const clearFilters = () => setSearch({ ...EMPTY_FILTERS });

  return (
    <>
      <AppointmentSummaryCards upcoming={counts.upcoming} completed={counts.completed} cancelled={counts.cancelled} />

      <Tabs value={tab} onValueChange={(v) => setTab(v === "past" ? "past" : "upcoming")}>
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl border border-border bg-card p-1 sm:inline-grid sm:w-80" aria-label="Appointment time">
          <TabsTrigger value="upcoming" className="h-10 rounded-lg font-semibold data-[state=active]:bg-teal data-[state=active]:text-teal-foreground">
            Upcoming ({counts.upcoming})
          </TabsTrigger>
          <TabsTrigger value="past" className="h-10 rounded-lg font-semibold data-[state=active]:bg-teal data-[state=active]:text-teal-foreground">
            Past ({counts.past})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <p className="flex items-start gap-2 rounded-lg border border-primary/20 bg-accent px-3 py-2 text-sm text-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span>
          <strong className="text-primary">Demo appointment data</strong> — Sample appointments for demonstration only. No real hospital bookings. Changes
          reset when the page is refreshed.
        </span>
      </p>

      <div className="hidden md:block">
        <DesktopFilters filters={filters} tab={tab} hospitals={hospitals} onChange={(f) => setSearch(f)} onClear={clearFilters} />
      </div>
      <div className="flex items-center justify-between gap-3 md:hidden">
        <MobileFilterDrawer filters={filters} tab={tab} hospitals={hospitals} onApply={(f) => setSearch(f)} />
        {filtered && (
          <Button variant="link" className="h-auto p-0" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <section aria-labelledby={RESULTS_HEADING_ID} className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id={RESULTS_HEADING_ID} tabIndex={-1} className="font-display text-lg font-bold text-navy focus:outline-none">
            {tab === "upcoming" ? "Upcoming appointments" : "Past appointments"}
          </h2>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {results.length === 0 ? "No matching appointments" : `Showing ${visible.length} of ${results.length}`}
          </p>
        </div>

        {results.length === 0 ? (
          filtered || tabTotal > 0 ? (
            <EmptyState
              icon={<Search className="h-8 w-8" />}
              title="No appointments found"
              body="Try adjusting or clearing your filters."
              action={<Button onClick={clearFilters}>Clear Filters</Button>}
            />
          ) : tab === "upcoming" ? (
            <EmptyState
              icon={<CalendarDays className="h-8 w-8" />}
              title="No upcoming appointments"
              body="You don't have any demonstration appointments scheduled."
              action={
                <Button asChild variant="teal">
                  <Link to="/hospitals" search={DIRECTORY_DEFAULTS}>
                    Find Hospitals
                  </Link>
                </Button>
              }
            />
          ) : (
            <EmptyState icon={<CalendarClock className="h-8 w-8" />} title="No past appointments" body="Completed, cancelled and missed visits will appear here." />
          )
        ) : (
          <ul className="space-y-3" data-testid="appointment-results">
            {visible.map((a) => (
              <li key={a.id}>
                <AppointmentCard appointment={a} now={now} search={search} />
              </li>
            ))}
          </ul>
        )}

        {visible.length < results.length && (
          <div className="flex justify-center pt-2">
            <Button variant="outline" className="h-11 px-6" onClick={() => setPage({ key: pageKey, n: visibleCount + PAGE_SIZE })}>
              Load More
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

function AppointmentSummaryCards({ upcoming, completed, cancelled }: { upcoming: number; completed: number; cancelled: number }) {
  const items = [
    { label: "Upcoming", value: upcoming, icon: CalendarClock, cls: "bg-accent text-primary" },
    { label: "Completed", value: completed, icon: CalendarCheck, cls: "bg-teal-soft text-teal" },
    { label: "Cancelled", value: cancelled, icon: CalendarX, cls: "bg-destructive/10 text-destructive" },
  ];
  return (
    <section aria-label="Appointment summary">
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.map(({ label, value, icon: Icon, cls }) => (
          <li key={label} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center sm:gap-3 sm:p-4">
            <span aria-hidden className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11", cls)}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="min-w-0">
              <span className="block font-display text-2xl font-extrabold leading-none text-navy" data-testid={`summary-${label.toLowerCase()}`}>
                {value}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">{label}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Hosp = { id: string; name: string };

/** Search + status/hospital/date/sort, shared by the desktop bar and mobile drawer. */
function FilterFields({
  value,
  onChange,
  tab,
  hospitals,
  idPrefix,
  layout,
}: {
  value: AppointmentFilters;
  onChange: (f: AppointmentFilters) => void;
  tab: AppointmentTab;
  hospitals: Hosp[];
  idPrefix: string;
  layout: "bar" | "stack";
}) {
  const rangeError = dateRangeError(value);
  const labelCls = "text-sm font-semibold text-navy";
  const select = (id: string, label: string, v: string, set: (v: string) => void, options: { value: string; label: string }[]) => (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={`${idPrefix}-${id}`} className={labelCls}>
        {label}
      </Label>
      <Select value={v} onValueChange={set}>
        <SelectTrigger id={`${idPrefix}-${id}`} className="h-11 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-q`} className={cn(labelCls, layout === "bar" && "sr-only")}>
          Search
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id={`${idPrefix}-q`}
            type="search"
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            placeholder="Search by hospital or booking reference"
            className="h-11 bg-background pl-9"
          />
        </div>
      </div>
      <div className={cn("grid gap-3", layout === "bar" ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
        {select("status", "Status", value.status, (status) => onChange({ ...value, status }), [
          { value: "all", label: "All statuses" },
          ...STATUS_OPTIONS[tab].map((s) => ({ value: s, label: s })),
        ])}
        {select("hospital", "Hospital", value.hospital, (hospital) => onChange({ ...value, hospital }), [
          { value: "all", label: "All hospitals" },
          ...hospitals.map((h) => ({ value: h.id, label: h.name })),
        ])}
        {select("range", "Date Range", value.range, (range) => onChange({ ...value, range, ...(range === "custom" ? {} : { from: "", to: "" }) }), RANGE_OPTIONS[tab])}
        {select("sort", "Sort", effectiveSort(value, tab), (sort) => onChange({ ...value, sort }), SORT_OPTIONS)}
      </div>
      {value.range === "custom" && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            {(["from", "to"] as const).map((k) => (
              <div key={k} className="min-w-0 space-y-1.5">
                <Label htmlFor={`${idPrefix}-${k}`} className={labelCls}>
                  {k === "from" ? "From" : "To"}
                </Label>
                <Input
                  id={`${idPrefix}-${k}`}
                  type="date"
                  value={value[k]}
                  aria-invalid={!!rangeError}
                  aria-describedby={rangeError ? `${idPrefix}-range-error` : undefined}
                  onChange={(e) => onChange({ ...value, [k]: e.target.value })}
                  className="h-11 bg-background"
                />
              </div>
            ))}
          </div>
          {rangeError ? (
            <p id={`${idPrefix}-range-error`} role="alert" className="text-sm font-medium text-destructive">
              {rangeError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Dates use Addis Ababa time. Leave either end empty for an open range.</p>
          )}
        </div>
      )}
    </div>
  );
}

function DesktopFilters({
  filters,
  tab,
  hospitals,
  onChange,
  onClear,
}: {
  filters: AppointmentFilters;
  tab: AppointmentTab;
  hospitals: Hosp[];
  onChange: (f: AppointmentFilters) => void;
  onClear: () => void;
}) {
  return (
    <section aria-label="Search and filter appointments" className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <FilterFields value={filters} onChange={onChange} tab={tab} hospitals={hospitals} idPrefix="appt-filter" layout="bar" />
      <div className="mt-3 flex justify-end">
        <Button variant="link" className="h-auto p-0" onClick={onClear} disabled={activeFilterCount(filters) === 0 && !filters.sort}>
          Clear All
        </Button>
      </div>
    </section>
  );
}

function MobileFilterDrawer({
  filters,
  tab,
  hospitals,
  onApply,
}: {
  filters: AppointmentFilters;
  tab: AppointmentTab;
  hospitals: Hosp[];
  onApply: (f: AppointmentFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AppointmentFilters>(filters);
  const count = activeFilterCount(filters);
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(filters); // edits only touch the draft until Apply
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" className="h-11 gap-2" aria-label={count ? `Filters, ${count} active` : "Filters"}>
          <SlidersHorizontal aria-hidden /> Filters
          {count > 0 && (
            <span aria-hidden className="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-xs font-bold text-teal-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="flex max-h-[90dvh] flex-col rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SheetHeader>
          <SheetTitle className="text-left font-display text-navy">Filter Appointments</SheetTitle>
          <SheetDescription className="text-left">Changes apply when you select Apply Filters.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <FilterFields value={draft} onChange={setDraft} tab={tab} hospitals={hospitals} idPrefix="appt-drawer" layout="stack" />
        </div>
        <SheetFooter className="flex-row gap-3 px-4">
          <Button variant="outline" className="h-11 flex-1" onClick={() => setDraft({ ...EMPTY_FILTERS })}>
            Clear All
          </Button>
          <Button
            variant="teal"
            className="h-11 flex-1"
            disabled={!!dateRangeError(draft)}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function AppointmentCard({ appointment: a, now, search }: { appointment: Appointment; now: Date; search: AppointmentsSearch }) {
  const elig = managementEligibility(a, now);
  const d = a.appointmentDateTime;
  const detailsLink = { to: "/patient/appointments/$id", params: { id: a.id }, search } as const;
  const label = `${a.hospital.name}, ${a.department}, ${formatDate(d)} at ${formatTime(d)}, ${a.status}`;

  return (
    <article className="rounded-2xl border border-border bg-card shadow-card" data-testid="appointment-card" aria-label={label}>
      {/* Mobile: the whole card opens details; actions live on the details page. */}
      <Link
        {...detailsLink}
        className="flex items-center gap-3 rounded-2xl p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        aria-label={`View details: ${label}`}
      >
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
          <Building2 className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-navy">{a.hospital.name}</span>
          <span className="block text-xs text-muted-foreground">{a.department}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              {formatDate(d)} · {formatTime(d)}
            </span>
            <StatusBadge status={a.status} />
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      </Link>

      {/* Tablet/desktop: aligned row with actions. */}
      <div className="hidden gap-4 p-4 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:items-center xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_7rem_auto]">
        <div className="flex min-w-0 items-start gap-3">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-navy">{a.hospital.name}</h3>
            <p className="text-sm text-muted-foreground">{a.department}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
              <UserRound className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              {a.doctor ? a.doctor.displayName : <span className="text-muted-foreground">Doctor not yet assigned</span>}
            </p>
          </div>
        </div>
        <div className="min-w-0 space-y-0.5 text-sm">
          <p className="flex items-center gap-1.5 text-foreground">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {formatDate(d)}
          </p>
          <p className="flex items-center gap-1.5 text-foreground">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {formatTime(d)}
          </p>
          <p className="text-xs text-muted-foreground xl:hidden">
            Ref. <span className="font-mono font-semibold text-foreground">{a.bookingReference}</span>
          </p>
        </div>
        <div className="hidden text-sm xl:block">
          <p className="text-xs text-muted-foreground">Booking Ref.</p>
          <p className="font-mono font-semibold text-foreground">{a.bookingReference}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={a.status} />
          <div className="flex flex-wrap justify-end gap-2">
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link {...detailsLink} aria-label={`View details for ${a.bookingReference}`}>
                View Details
              </Link>
            </Button>
            {elig.allowed && (
              <>
                <RescheduleAppointmentDialog
                  appointment={a}
                  fallbackFocusId={RESULTS_HEADING_ID}
                  trigger={
                    <Button variant="outline" size="sm" className="h-9 text-primary" aria-label={`Reschedule ${a.bookingReference}`}>
                      Reschedule
                    </Button>
                  }
                />
                <CancelAppointmentDialog
                  appointment={a}
                  fallbackFocusId={RESULTS_HEADING_ID}
                  trigger={
                    <Button variant="outline" size="sm" className="h-9 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={`Cancel ${a.bookingReference}`}>
                      Cancel
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-primary">
        {icon}
      </span>
      <h3 className="mt-3 font-display text-lg font-bold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
