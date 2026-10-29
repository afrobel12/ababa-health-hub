import { ArrowRight, CalendarDays, FileText, Search, User, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/navigation";
import buildingImg from "@/assets/hospital-building.jpg";
import { NavLink } from "./coming-soon";

type Item = { icon: LucideIcon; title: string; text: string };

const steps: Item[] = [
  { icon: Search, title: "Search hospitals", text: "Find participating hospitals across Ethiopia by location, department or name." },
  { icon: CalendarDays, title: "Choose an appointment", text: "View available appointment times and select what works for you." },
  { icon: FileText, title: "Manage bookings", text: "Log in to book, view and manage your appointments in one place." },
];

const features: Item[] = [
  { icon: CalendarDays, title: "Appointment Management", text: "Find and manage appointments at participating hospitals." },
  { icon: User, title: "Personal Patient Dashboard", text: "Keep track of your appointments, visit information and notifications." },
  { icon: FileText, title: "Authorized Medical History", text: "View medical information that participating hospitals have authorized you to access." },
];

function SectionHead({ title, tagline }: { title: string; tagline: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      <p className="flex items-center gap-1.5 text-sm font-medium text-primary">{tagline} <ArrowRight className="h-4 w-4" aria-hidden /></p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section aria-label="How It Works" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <SectionHead title="How It Works" tagline="Simple steps to access better healthcare" />
      <ol className="grid gap-3 sm:gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4 sm:gap-4 sm:p-6 shadow-card transition-shadow hover:shadow-float">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full sm:h-14 sm:w-14 bg-accent text-primary">
              <s.icon className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function KeyFeatures() {
  return (
    <section aria-label="Key Features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHead title="Key Features" tagline="A smarter way to manage your healthcare" />
      <div className="grid gap-3 sm:gap-5 md:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4 sm:gap-4 sm:p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-float">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full sm:h-14 sm:w-14 bg-teal-soft text-teal">
              <f.icon className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-navy">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ForHospitals() {
  return (
    <section aria-labelledby="partner-title" className="bg-teal-soft">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <img src={buildingImg} alt="Exterior of a modern hospital building surrounded by trees" width={1280} height={800} loading="lazy" className="h-64 w-full object-cover sm:h-80 lg:h-full" />
        <div className="px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
          <p className="text-xs font-bold tracking-[0.25em] text-teal">PARTNER WITH US</p>
          <h2 id="partner-title" className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Let's build a stronger healthcare system for Ethiopia together.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Join the Ethiopian Healthcare Management System and help patients discover your hospital, request
            appointments and access better-coordinated healthcare services.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 bg-teal px-7 text-base text-teal-foreground hover:bg-teal/90">
            <NavLink target={{ ...routes.forHospitals, label: "Hospital Partnership" }}>
              Explore Hospital Partnership <ArrowRight className="h-5 w-5" aria-hidden />
            </NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
