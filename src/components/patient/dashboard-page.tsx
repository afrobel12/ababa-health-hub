import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, CalendarPlus, FileHeart, Users } from "lucide-react";
import welcomeImg from "@/assets/patient-welcome.jpg";
import { useComingSoon } from "@/components/home/coming-soon";
import { DIRECTORY_DEFAULTS } from "@/data/directory-search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { futureTarget, patientNav } from "@/config/patient-navigation";
import {
  MOCK_PATIENT,
  appointmentSummary,
  buildAppointments,
  buildMedicalHistory,
  buildNotifications,
} from "@/data/patient-demo";
import { useDemoNow } from "@/hooks/use-demo-now";
import { AppointmentOverview, RecentNotifications, UpcomingAppointmentsPreview } from "./appointment-sections";
import { MedicalHistoryPreview } from "./medical-history-preview";
import { PatientProfileSummary } from "./profile-summary";

export function PatientDashboardPage() {
  const now = useDemoNow();
  const data = useMemo(() => {
    if (!now) return null;
    const appointments = buildAppointments(now);
    return {
      now,
      summary: appointmentSummary(appointments, now),
      notifications: buildNotifications(now, appointments).slice(0, 3),
      history: buildMedicalHistory(now),
    };
  }, [now]);

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <PatientQuickActions />
      {data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <AppointmentOverview summary={data.summary} />
            <UpcomingAppointmentsPreview upcoming={data.summary.upcoming} />
            <MedicalHistoryPreview groups={data.history} />
          </div>
          <div className="min-w-0 space-y-6">
            <PatientProfileSummary now={data.now} />
            <RecentNotifications notifications={data.notifications} now={data.now} />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3" aria-hidden>
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      )}
    </div>
  );
}

function WelcomeBanner() {
  return (
    <section
      aria-labelledby="welcome-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-accent to-teal-soft shadow-card"
    >
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
        <div className="p-5 sm:p-8">
          <h1 id="welcome-heading" className="font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Welcome back, {MOCK_PATIENT.displayName}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground sm:text-lg">
            Manage your appointments, book new visits, and access your health information.
          </p>
          <Button asChild size="lg" className="mt-5 h-12 w-full px-6 text-base sm:w-auto">
            <Link to="/hospitals" search={DIRECTORY_DEFAULTS}>
              <CalendarPlus className="h-5 w-5" aria-hidden /> Book Appointment
            </Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Starts by finding a hospital. Booking is demonstration-only.</p>
        </div>
        <img
          src={welcomeImg}
          alt=""
          aria-hidden
          width={992}
          height={672}
          className="hidden h-52 w-auto object-contain mix-blend-multiply md:block lg:h-56"
        />
      </div>
    </section>
  );
}

function PatientQuickActions() {
  const open = useComingSoon();
  const cardCls =
    "group flex h-full w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5";
  const body = (Icon: typeof CalendarDays, title: string, desc: string) => (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary group-hover:bg-background">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-display font-bold text-navy">
          {title} <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </span>
        <span className="mt-1 block text-sm leading-snug text-muted-foreground">{desc}</span>
      </span>
    </>
  );
  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="sr-only">
        Quick actions
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <li>
          <Link to="/hospitals" search={DIRECTORY_DEFAULTS} className={cardCls}>
            {body(CalendarPlus, "Book Appointment", "Find a hospital, choose a department and explore available appointments.")}
          </Link>
        </li>
        <li>
          <button type="button" className={cardCls} onClick={() => open(futureTarget("My Appointments", patientNav.appointments.plannedPath))}>
            {body(CalendarDays, "My Appointments", "Review and manage your upcoming appointments.")}
          </button>
        </li>
        <li>
          <button type="button" className={cardCls} onClick={() => open(futureTarget("Medical History", patientNav.medicalHistory.plannedPath))}>
            {body(FileHeart, "Medical History", "View medical information available to your patient profile.")}
          </button>
        </li>
        <li>
          <button type="button" className={cardCls} onClick={() => open(futureTarget("My Dependents", patientNav.dependents.plannedPath))}>
            {body(Users, "My Dependents", "Manage authorized child appointment profiles.")}
          </button>
        </li>
      </ul>
    </section>
  );
}
