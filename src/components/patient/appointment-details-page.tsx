// P-02 appointment details. Reads the shared in-memory record; never falls back to another appointment.
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, CalendarDays, ChevronRight, Info, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { POLICY_TEXT, managementEligibility } from "@/data/patient-appointments";
import { MOCK_PATIENT, formatDate, formatTime } from "@/data/patient-demo";
import { cn } from "@/lib/utils";
import { usePatientAppointments } from "./appointments-provider";
import { CancelAppointmentDialog, RescheduleAppointmentDialog } from "./appointment-dialogs";
import { STATUS_CLS, StatusBadge } from "./status-badge";

const HEADING_ID = "appointment-details-heading";

export function PatientAppointmentDetailsPage() {
  const { id } = useParams({ from: "/patient/appointments/$id" });
  const search = useSearch({ from: "/patient/appointments/$id" });
  const { appointments, now, getAppointmentById } = usePatientAppointments();
  const back = (
    <Link to="/patient/appointments" search={search} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Back to My Appointments
    </Link>
  );
  if (!appointments || !now) return <div className="space-y-4">{back}<Skeleton className="h-24" /><Skeleton className="h-80" /></div>;
  const a = getAppointmentById(id);
  if (!a)
    return (
      <div className="space-y-4">
        {back}
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">Appointment not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">This demonstration appointment doesn't exist.</p>
          <Button asChild className="mt-4"><Link to="/patient/appointments" search={search}>Back to My Appointments</Link></Button>
        </div>
      </div>
    );
  const d = a.appointmentDateTime;
  const elig = managementEligibility(a, now);
  const rows: [string, string][] = [
    ["Hospital", a.hospital.name],
    ["Department", a.department],
    ["Doctor", a.doctor ? a.doctor.displayName : "Not yet assigned"],
    ["Patient", `${MOCK_PATIENT.displayName} (Self)`],
    ...(a.reasonForVisit ? ([["Reason for Visit", a.reasonForVisit]] as [string, string][]) : []),
    ["Appointment Date", formatDate(d)],
    ["Appointment Time", `${formatTime(d)} (Addis Ababa)`],
    ["Created", `${formatDate(a.createdAt)} · ${formatTime(a.createdAt)}`],
  ];
  return (
    <div className="space-y-5">
      {back}
      <header className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-r from-card via-accent to-teal-soft p-4 shadow-card sm:p-6">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-card text-teal shadow-card"><CalendarDays className="h-6 w-6" /></span>
        <div>
          <h1 id={HEADING_ID} tabIndex={-1} className="font-display text-2xl font-extrabold text-navy focus:outline-none sm:text-3xl">Appointment Details</h1>
          <p className="text-sm text-muted-foreground">View appointment information, status history, and available actions.</p>
        </div>
      </header>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <section aria-labelledby="appt-info" className="rounded-2xl border border-border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-2xl bg-accent px-4 py-3 sm:px-6">
              <div>
                <h2 id="appt-info" className="text-xs font-semibold text-muted-foreground">Booking Reference</h2>
                <p className="font-mono text-xl font-bold text-navy" data-testid="details-ref">{a.bookingReference}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <dl className="divide-y divide-border px-4 sm:px-6">
              {rows.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 text-sm sm:grid-cols-[10rem_1fr]">
                  <dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <p className="flex gap-2 rounded-2xl border border-primary/20 bg-accent p-4 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span><strong className="text-navy">Cancellation &amp; Rescheduling Policy</strong><br />{POLICY_TEXT}</span>
          </p>
        </div>
        <div className="min-w-0 space-y-5">
          <section aria-labelledby="appt-actions" className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
            <h2 id="appt-actions" className="mb-3 font-display text-lg font-bold text-navy">Appointment Actions</h2>
            {elig.allowed ? (
              <div className="space-y-3">
                <RescheduleAppointmentDialog appointment={a} fallbackFocusId={HEADING_ID} trigger={
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <CalendarClock className="h-5 w-5 text-teal" aria-hidden />
                    <span className="flex-1"><span className="block font-semibold text-primary">Reschedule Appointment</span><span className="text-xs text-muted-foreground">Choose a new date and time.</span></span>
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>} />
                <CancelAppointmentDialog appointment={a} fallbackFocusId={HEADING_ID} trigger={
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 p-3 text-left hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <XCircle className="h-5 w-5 text-destructive" aria-hidden />
                    <span className="flex-1"><span className="block font-semibold text-destructive">Cancel Appointment</span><span className="text-xs text-muted-foreground">Cancel this appointment.</span></span>
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>} />
              </div>
            ) : (
              <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground" data-testid="ineligible">{elig.reason}</p>
            )}
          </section>
          <section aria-labelledby="appt-history" className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
            <h2 id="appt-history" className="mb-3 font-display text-lg font-bold text-navy">Status History</h2>
            <ol className="space-y-4 border-l-2 border-border pl-5">
              {[...a.statusHistory].sort((x, y) => x.at.getTime() - y.at.getTime()).map((e, i) => (
                <li key={i} className="relative">
                  <span aria-hidden className={cn("absolute -left-[1.72rem] top-1 h-3.5 w-3.5 rounded-full border", STATUS_CLS[e.status])} />
                  <StatusBadge status={e.status} />
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(e.at)} · {formatTime(e.at)}</p>
                  <p className="text-sm text-foreground">{e.note}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
