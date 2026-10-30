import { Building2, Landmark, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hospital, HospitalType } from "@/data/hospitals";
import { cn } from "@/lib/utils";

/** Public/Private badge — distinguished by icon and text, not colour alone. */
export function TypeBadge({ type, className }: { type: HospitalType; className?: string }) {
  const isPublic = type === "Public";
  const Icon = isPublic ? Landmark : Building2;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isPublic ? "bg-teal-soft text-teal" : "bg-accent text-primary",
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {type}
    </span>
  );
}

export function DepartmentTags({ departments, className }: { departments: string[]; className?: string }) {
  const shown = departments.slice(0, 3);
  const extra = departments.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Departments">
      {shown.map((d) => (
        <li key={d} className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-foreground">
          {d}
        </li>
      ))}
      {extra > 0 && <li className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">+{extra} more</li>}
    </ul>
  );
}

export function HospitalCard({ hospital, onViewDetails }: { hospital: Hospital; onViewDetails: (h: Hospital) => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-float sm:flex-row">
      <img
        src={hospital.image}
        alt={hospital.imageAlt}
        width={960}
        height={720}
        loading="lazy"
        className="h-40 w-full shrink-0 object-cover sm:h-auto sm:w-44 lg:w-52"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-base font-bold text-navy sm:text-lg">{hospital.name}</h3>
          <TypeBadge type={hospital.type} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {hospital.city}, {hospital.region}
        </p>
        <DepartmentTags departments={hospital.departments} />
        <p className="text-sm leading-relaxed text-muted-foreground">{hospital.description}</p>
      </div>
      <div className="flex shrink-0 items-center p-4 pt-0 sm:p-5 sm:pl-0">
        <Button variant="outline" className="h-11 w-full border-primary text-primary hover:bg-accent hover:text-primary sm:w-auto" onClick={() => onViewDetails(hospital)}>
          View Details
        </Button>
      </div>
    </article>
  );
}
