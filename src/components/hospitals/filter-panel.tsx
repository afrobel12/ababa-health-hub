import { Building2, Landmark, MapPin, Search, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES, DEPARTMENTS, type DirectoryFilters, type TypeFilter } from "@/data/hospitals";
import { cn } from "@/lib/utils";

const ALL = "all";

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

/**
 * The four directory filter fields, shared by the desktop sidebar (applied
 * immediately) and the mobile drawer (edited as a draft, then applied).
 */
export function FilterFields({
  value,
  onChange,
  idPrefix,
}: {
  value: DirectoryFilters;
  onChange: (next: DirectoryFilters) => void;
  idPrefix: string;
}) {
  const field = "h-11 w-full bg-background";
  const labelCls = "flex items-center gap-1.5 text-sm font-medium text-navy";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-city`} className={labelCls}>
          <MapPin className="h-4 w-4 text-primary" aria-hidden /> City or Region
        </Label>
        <Select value={value.city || ALL} onValueChange={(v) => onChange({ ...value, city: v === ALL ? "" : v })}>
          <SelectTrigger id={`${idPrefix}-city`} className={field}>
            <SelectValue placeholder="All cities and regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All cities and regions</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={labelCls}>
          <Landmark className="h-4 w-4 text-primary" aria-hidden /> Hospital Type
        </legend>
        <div className="flex rounded-full border border-border bg-muted p-1" role="group" aria-label="Hospital type">
          {TYPE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={value.type === o.value}
              onClick={() => onChange({ ...value, type: o.value })}
              className={cn(
                "h-9 flex-1 rounded-full text-sm font-medium transition-colors",
                value.type === o.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-dept`} className={labelCls}>
          <Stethoscope className="h-4 w-4 text-primary" aria-hidden /> Department
        </Label>
        <Select value={value.department || ALL} onValueChange={(v) => onChange({ ...value, department: v === ALL ? "" : v })}>
          <SelectTrigger id={`${idPrefix}-dept`} className={field}>
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-q`} className={labelCls}>
          <Building2 className="h-4 w-4 text-primary" aria-hidden /> Hospital Name
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id={`${idPrefix}-q`}
            className={cn(field, "pl-9")}
            placeholder="Search by hospital name..."
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
