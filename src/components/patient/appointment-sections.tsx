import { Link } from "@tanstack/react-router";
import { Bell, Building2, CalendarCheck, CalendarClock, CalendarDays, Clock, History, Megaphone, Stethoscope } from "lucide-react";
import { useComingSoon } from "@/components/home/coming-soon";
import { Button } from "@/components/ui/button";
import { futureTarget, patientNav } from "@/config/patient-navigation";
import {
  formatDate,
  formatRelative,
  formatTime,
  type Appointment,
  type NotificationCategory,
  type PatientNotification,
  type appointmentSummary,
} from "@/data/patient-demo";
import { cn } from "@/lib/utils";
import { DashboardCard } from "./dashboard-page";
import { StatusBadge } from "./status-badge";

type Summary = ReturnType<typeof appointmentSummary>;

export function AppointmentOverview({ summary }: { summary: Summary }) {
  return (
    <section aria-labelledby="overview-heading" className="space-y-4">
      <h2 id="overview-heading" className="sr-only">
        Appointment overview
      </h2>
      <NextAppointmentCard next={summary.next} />
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={<CalendarClock className="h-5 w-5" />} label="Upcoming appointments" value={summary.upcoming.length} />
        <Stat icon={<History className="h-5 w-5" />} label="Past appointments" value={summary.past.length} />
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal">
        {icon}
      </span>
      <p className="min-w-0">
        <span className="block font-display text-2xl font-extrabold text-navy">{value}</span>
        <span className="block text-xs leading-tight text-muted-foreground sm:text-sm">{label}</span>
      </p>
    </div>
  );
}

export function NextAppointmentCard({ next }: { next: Appointment | null }) {
  const open = useComingSoon();
  if (!next) {
    return (
      <DashboardCard id="next-appt-heading" title="Next Appointment">
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <h3 className="mt-3 font-display font-bold text-navy">No upcoming appointments</h3>
          <p className="mt-1 text-sm text-muted-foreground">You don't have any demonstration appointments scheduled.</p>
          <Button asChild className="mt-4">
            <Link to="/hospitals">Find Hospitals</Link>
          </Button>
        </div>
      </DashboardCard>
    );
  }
  const d = next.appointmentDateTime;
  return (
    <DashboardCard
      id="next-appt-heading"
      title="Next Appointment"
      className="border-primary/20"
      action={<span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Demo data</span>}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center gap-3 rounded-xl bg-primary p-4 text-primary-foreground sm:w-40 sm:flex-col sm:items-start">
          <CalendarCheck className="h-6 w-6" aria-hidden />
          <div>
            <p className="font-display text-lg font-bold leading-tight">{formatDate(d)}</p>
            <p className="text-sm opacity-90">{formatTime(d)} (Addis Ababa)</p>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold text-navy">{next.hospital.name}</h3>
            <StatusBadge status={next.status} />
          </div>
          <p className="flex items-center gap-2 text-foreground">
            <Stethoscope className="h-4 w-4 shrink-0 text-primary" aria-hidden /> {next.department}
          </p>
          <p className="flex items-center gap-2 text-foreground">
            <Building2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {next.doctor ? next.doctor.displayName : "Doctor not yet assigned"}
          </p>
          <p className="text-muted-foreground">
            Booking reference: <span className="font-mono font-medium text-foreground">{next.bookingReference}</span>
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={() => open(futureTarget("Appointment Details", patientNav.appointments.plannedPath))}>
              View Details
            </Button>
            <Button
              variant="ghost"
              className="text-primary"
              onClick={() =>
                open(
                  futureTarget(
                    "Reschedule",
                    patientNav.appointments.plannedPath,
                    "Rescheduling will be available in a future design phase. This demonstration appointment has not been changed.",
                  ),
                )
              }
            >
              Reschedule
            </Button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export function UpcomingAppointmentsPreview({ upcoming }: { upcoming: Appointment[] }) {
  const open = useComingSoon();
  const items = upcoming.slice(0, 3);
  return (
    <DashboardCard
      id="upcoming-heading"
      title="Upcoming Appointments"
      action={
        <Button variant="link" className="h-auto p-0" onClick={() => open(futureTarget("Appointments", patientNav.appointments.plannedPath))}>
          View All
        </Button>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming demonstration appointments.</p>
      ) : (
        <ol className="divide-y divide-border">
          {items.map((a) => (
            <li key={a.id} data-testid="upcoming-item" className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{a.hospital.name}</p>
                <p className="text-sm text-muted-foreground">{a.department}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5 text-foreground">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden /> {formatDate(a.appointmentDateTime)}
                </span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden /> {formatTime(a.appointmentDateTime)}
                </span>
                <StatusBadge status={a.status} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </DashboardCard>
  );
}

const CATEGORY_ICON: Record<NotificationCategory, typeof Bell> = {
  booking: CalendarCheck,
  reminder: Bell,
  reschedule: CalendarClock,
  platform: Megaphone,
};

export function RecentNotifications({ notifications, now }: { notifications: PatientNotification[]; now: Date }) {
  const open = useComingSoon();
  return (
    <DashboardCard
      id="notifications-heading"
      title="Recent Notifications"
      action={
        <Button variant="link" className="h-auto p-0" onClick={() => open(futureTarget("Notifications", patientNav.notifications.plannedPath))}>
          View All
        </Button>
      }
    >
      <ul className="space-y-3">
        {notifications.map((n) => {
          const Icon = CATEGORY_ICON[n.category];
          return (
            <li key={n.id} className="flex gap-3">
              <span aria-hidden className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", n.read ? "bg-muted text-muted-foreground" : "bg-accent text-primary")}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 text-sm">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  {n.title}
                  {!n.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary">
                      <span className="sr-only">Unread</span>
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground">{n.shortMessage}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(n.createdAt, now)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
