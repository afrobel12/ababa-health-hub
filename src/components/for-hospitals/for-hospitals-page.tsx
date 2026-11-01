import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  ClipboardList,
  Info,
  Search,
  Settings2,
  Users,
  type LucideIcon,
} from "lucide-react";
import buildingImg from "@/assets/hospital-building.jpg";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicPageShell, SectionHeading } from "@/components/public/page-shell";

type Item = { icon: LucideIcon; title: string; text: string };

const capabilities: Item[] = [
  {
    icon: CalendarDays,
    title: "Appointment Management",
    text: "Intended to let patients discover your hospital, view available services and request appointment times.",
  },
  {
    icon: Users,
    title: "Staff Workspaces",
    text: "Planned separate workspaces for doctors and receptionists to manage schedules and daily appointments.",
  },
  {
    icon: Building2,
    title: "Hospital Management",
    text: "Designed to help managers maintain departments, staff and appointment availability in one place.",
  },
];

const onboarding: Item[] = [
  { icon: ClipboardList, title: "Submit Application", text: "Provide basic hospital and representative details." },
  { icon: Search, title: "Platform Verification", text: "The platform owner reviews and verifies the information provided." },
  { icon: BadgeCheck, title: "Approval Decision", text: "The platform owner decides whether the hospital can participate." },
  { icon: Settings2, title: "Account Setup", text: "Only approved hospitals receive workspaces for their staff." },
];

export const PARTNERSHIP_FAQ = [
  {
    q: "Who can apply?",
    a: "The platform is intended for participating public and private hospitals in Ethiopia. Applications are subject to formal review.",
  },
  {
    q: "What happens after applying?",
    a: "In the planned process, the platform owner reviews the application, verifies the institution and then makes an approval decision.",
  },
  {
    q: "Does applying automatically activate our hospital?",
    a: "No. Submitting an application never grants access. A hospital is activated only after verification and approval by the platform owner.",
  },
  {
    q: "Can public and private hospitals participate?",
    a: "Yes. Both public and private hospitals are welcome to apply, subject to the same review.",
  },
  {
    q: "Will hospital staff receive separate workspaces?",
    a: "That is the intention. Approved hospitals are planned to have separate workspaces for managers, doctors and receptionists, each with appropriate permissions.",
  },
  {
    q: "How will pricing work?",
    a: "Commercial terms have not yet been established. No prices, subscription plans or payment arrangements apply at this stage.",
  },
];

function scrollToCapabilities() {
  const el = document.getElementById("capabilities");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

function PartnershipHero() {
  return (
    <section className="bg-sky">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-teal-soft px-3 py-1 text-xs font-bold tracking-wider text-teal">
            FOR HEALTHCARE INSTITUTIONS
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
            Connect your hospital with more patients.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Apply to participate in Ethiopia's healthcare appointment and management platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link to="/for-hospitals/apply">
                Apply to Join <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="h-12 border-primary px-7 text-base text-primary hover:text-primary"
              onClick={scrollToCapabilities}
            >
              Learn More
            </Button>
          </div>
        </div>
        <img
          src={buildingImg}
          alt="Illustrative modern hospital building (not a participating institution)"
          width={1280}
          height={800}
          className="aspect-[16/10] w-full rounded-2xl object-cover shadow-float"
        />
      </div>
    </section>
  );
}

function PlatformCapabilityCards() {
  return (
    <section
      id="capabilities"
      tabIndex={-1}
      aria-labelledby="capabilities-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-12 outline-none sm:px-6 sm:pt-16 lg:px-8"
    >
      <SectionHeading id="capabilities-title" title="Platform Capabilities" intro="What the platform is being designed to offer participating hospitals." />
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {capabilities.map((c) => (
          <article key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-float">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
              <c.icon className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OnboardingSteps() {
  return (
    <section aria-labelledby="onboarding-title" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="rounded-2xl bg-sky p-6 sm:p-10">
        <SectionHeading
          id="onboarding-title"
          title="How Hospital Onboarding Works"
          intro="The platform owner must verify and approve every hospital before activation. Applying does not grant access."
        />
        <ol className="grid gap-6 md:grid-cols-4 md:gap-4">
          {onboarding.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              {i < onboarding.length - 1 && (
                <>
                  <span aria-hidden className="absolute left-7 top-14 h-[calc(100%-2rem)] w-px bg-border md:hidden" />
                  <ArrowRight aria-hidden className="absolute -right-4 top-5 hidden h-5 w-5 text-muted-foreground md:block" />
                </>
              )}
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-card text-primary shadow-card">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 pt-1 md:pt-0">
                <h3 className="font-bold text-navy">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Eligibility() {
  return (
    <section aria-labelledby="eligibility-title" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <SectionHeading
          id="eligibility-title"
          title="Eligibility and Verification"
          intro="The platform is intended for participating public and private hospitals in Ethiopia."
        />
        <div className="flex gap-3 rounded-2xl border border-border bg-card p-6 shadow-card">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-navy">Requirements are subject to formal review</p>
            <p className="mt-1">
              Eligibility and verification requirements have not been finalised. Any future requirements will be
              confirmed during a formal review process before hospitals are onboarded.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnershipFAQ() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading id="faq-title" title="Frequently Asked Questions" />
      <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5 shadow-card">
        {PARTNERSHIP_FAQ.map((f, i) => (
          <AccordionItem key={f.q} value={`faq-${i}`} className="last:border-b-0">
            <AccordionTrigger className="min-h-12 text-base font-semibold text-navy hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function ApplicationCta() {
  return (
    <section aria-labelledby="apply-cta-title" className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <h2 id="apply-cta-title" className="max-w-xl text-2xl font-extrabold sm:text-3xl">
          Ready to bring your hospital onto the platform?
        </h2>
        <Button asChild size="lg" variant="secondary" className="h-12 px-7 text-base text-primary">
          <Link to="/for-hospitals/apply">
            Start Hospital Application <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function ForHospitalsPage() {
  return (
    <PublicPageShell>
      <PartnershipHero />
      <PlatformCapabilityCards />
      <OnboardingSteps />
      <Eligibility />
      <PartnershipFAQ />
      <ApplicationCta />
    </PublicPageShell>
  );
}
