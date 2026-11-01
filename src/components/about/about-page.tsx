import { Link } from "@tanstack/react-router";
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Lock,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import { Button } from "@/components/ui/button";
import { PublicPageHero, PublicPageShell, SectionHeading } from "@/components/public/page-shell";

type Item = { icon: LucideIcon; title: string; text: string };

const mission: Item[] = [
  { icon: Search, title: "Improve hospital discovery", text: "Help people find participating hospitals by location, department and name." },
  { icon: CalendarCheck, title: "Simplify appointment access", text: "Make it easier to see available times and request appointments." },
  { icon: Stethoscope, title: "Support professionals", text: "Give doctors and receptionists clear tools for their daily schedules." },
  { icon: Building2, title: "Independent workspaces", text: "Give each institution its own management workspace." },
];

const audiences: Item[] = [
  { icon: UserRound, title: "Patients", text: "Search hospitals, request appointments and view authorized information." },
  { icon: Stethoscope, title: "Doctors", text: "See their schedule and the appointments assigned to them." },
  { icon: ClipboardList, title: "Receptionists", text: "Coordinate bookings and arrivals for their hospital." },
  { icon: UserCog, title: "Hospital Managers", text: "Manage departments, staff and appointment availability." },
  { icon: Building2, title: "Participating Hospitals", text: "Reach patients through a shared, trusted directory." },
];

const howItWorks = [
  "Patients search the directory and choose a participating hospital.",
  "They pick a department, optionally a doctor, and an available time.",
  "Hospital staff manage the appointment within their own workspace.",
];

const privacy: Item[] = [
  { icon: Building2, title: "Hospitals operate independently", text: "Each hospital manages its own workspace, staff and appointments." },
  { icon: HeartPulse, title: "Records stay hospital-specific", text: "Medical records belong to the hospital where care was given." },
  { icon: Lock, title: "Access requires authorization", text: "People only see information their role and permissions allow." },
  { icon: Users, title: "No automatic sharing", text: "Information is not shared between hospitals automatically." },
];

function Cards({ items, cols }: { items: Item[]; cols: string }) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((c) => (
        <article key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
            <c.icon className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mt-3 font-bold text-navy">{c.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
        </article>
      ))}
    </div>
  );
}

export function AboutPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        eyebrow="ABOUT THE PLATFORM"
        title="Connecting patients and healthcare providers across Ethiopia."
        description="The Ethiopian Healthcare Management System is being designed as one place where patients find participating hospitals and request appointments, and where hospitals manage their services."
      />

      <section id="mission" tabIndex={-1} aria-labelledby="mission-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-12 outline-none sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <img src={heroImg} alt="A clinician speaking with a mother and child" width={1280} height={960} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
          <div className="min-w-0">
            <SectionHeading id="mission-title" title="Our Mission" intro="To make healthcare easier to reach for patients, and easier to run for the institutions that provide it." />
            <Cards items={mission} cols="sm:grid-cols-2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="serves-title" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading id="serves-title" title="Who the Platform Serves" />
        <Cards items={audiences} cols="sm:grid-cols-2 lg:grid-cols-5" />
      </section>

      <section aria-labelledby="about-how-title" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="rounded-2xl bg-sky p-6 sm:p-10">
          <SectionHeading id="about-how-title" title="How It Works" />
          <ol className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((t, i) => (
              <li key={t} className="flex gap-3 rounded-xl bg-card p-5 shadow-card">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <p className="text-sm leading-relaxed text-foreground">{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="privacy-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading id="privacy-title" title="Privacy and Hospital Separation" intro="These are the principles the platform is being designed around." />
        <Cards items={privacy} cols="sm:grid-cols-2 lg:grid-cols-4" />
        <p className="mt-5 flex gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
          This prototype is a design preview and does not yet provide production-grade security.
        </p>
      </section>

      <section aria-labelledby="about-cta-title" className="bg-teal-soft">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <h2 id="about-cta-title" className="text-2xl font-extrabold text-navy sm:text-3xl">Explore the platform</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7">
              <Link to="/hospitals">Find Hospitals</Link>
            </Button>
            <Button asChild size="lg" className="h-12 bg-teal px-7 text-teal-foreground hover:bg-teal/90">
              <Link to="/for-hospitals">For Hospitals</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
