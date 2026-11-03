import type { AppointmentStatus, RecordAccess } from "@/data/patient-demo";
import { cn } from "@/lib/utils";

// One status palette for the dashboard, list, details and history timeline.
export const STATUS_CLS: Record<AppointmentStatus, string> = {
  Booked: "border-success-border bg-success-soft text-success",
  "Checked In": "border-primary/20 bg-accent text-primary",
  Completed: "border-teal/30 bg-teal-soft text-teal",
  Cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
  Rescheduled: "border-warning-border bg-warning-soft text-warning",
  "No-show": "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", STATUS_CLS[status], className)}>
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}

export const ACCESS_LABEL: Record<RecordAccess, string> = {
  available: "Available to patient",
  "not-shared": "Not shared",
  restricted: "Restricted",
};
const ACCESS_CLS: Record<RecordAccess, string> = {
  available: "border-teal/30 bg-teal-soft text-teal",
  "not-shared": "border-border bg-muted text-muted-foreground",
  restricted: "border-warning-border bg-warning-soft text-warning",
};

export function AccessBadge({ access }: { access: RecordAccess }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", ACCESS_CLS[access])}>
      <span className="sr-only">Record access: </span>
      {ACCESS_LABEL[access]}
    </span>
  );
}
