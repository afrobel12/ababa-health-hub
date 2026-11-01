import { useEffect, useRef, useState } from "react";
import { Info, ShieldCheck } from "lucide-react";
import illustration from "@/assets/hospital-illustration-1.jpg";
import { WizardStepper } from "@/components/register/stepper";
import type { FieldErrors } from "@/components/register/validation";
import { PageBreadcrumbs, PublicPageShell } from "@/components/public/page-shell";
import {
  ApplicationCompleteStep,
  ApplicationReviewStep,
  HospitalInformationStep,
  RepresentativeInformationStep,
} from "./application-steps";
import {
  allowedStep,
  emptyHospitalInfo,
  emptyRepresentative,
  hasErrors,
  tidyHospitalInfo,
  validateHospitalInfo,
  validateRepresentative,
  type HospitalInfo,
  type RepresentativeInfo,
} from "./application-validation";

export const APPLICATION_STEP_LABELS = ["Hospital", "Representative", "Review", "Complete"] as const;

const STEP_COPY = [
  { title: "Tell us about your hospital", desc: "Provide the basic institutional information for your demonstration application." },
  { title: "Hospital representative", desc: "Tell us who is applying on behalf of the hospital." },
  { title: "Review your application", desc: "Check the details below. Use Edit to change anything before submitting." },
  { title: "Application preview submitted.", desc: "Thank you for exploring the hospital application process." },
] as const;

const SIDE_NOTES = [
  "Institution details help the platform owner understand your hospital.",
  "Representative details identify who would be contacted about the application.",
  "Nothing is sent. Reviewing simply shows what a real application would contain.",
  "Any future application would be verified and approved before activation.",
];

/**
 * Four-step demonstration wizard. All values live in this component's state,
 * so leaving the route unmounts it and discards everything.
 */
export function HospitalApplicationWizard() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [hospital, setHospital] = useState<HospitalInfo>(emptyHospitalInfo);
  const [rep, setRep] = useState<RepresentativeInfo>(emptyRepresentative);
  const [hospitalErrors, setHospitalErrors] = useState<FieldErrors<HospitalInfo>>({});
  const [repErrors, setRepErrors] = useState<FieldErrors<RepresentativeInfo>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const show = (next: number) => {
    // Going back to step 1 clears representative errors so they don't reappear stale.
    if (next < step && next < 1) setRepErrors({});
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  /** Stepper navigation: backwards freely, forwards only through valid steps. */
  const goTo = (target: number) => {
    if (target <= step) return show(target);
    const ok = allowedStep(target, hospital, rep);
    if (ok < target) {
      if (ok === 0) setHospitalErrors(validateHospitalInfo(hospital));
      else setRepErrors(validateRepresentative(rep));
    }
    show(ok);
  };

  const continueHospital = () => {
    const tidy = tidyHospitalInfo(hospital);
    const errs = validateHospitalInfo(tidy);
    setHospital(tidy);
    setHospitalErrors(errs);
    if (!hasErrors(errs)) show(1);
  };

  const continueRep = () => {
    const errs = validateRepresentative(rep);
    setRepErrors(errs);
    if (!hasErrors(errs)) show(2);
  };

  const submit = () => {
    // No network request and no record: discard everything entered, then show completion.
    setHospital(emptyHospitalInfo);
    setRep(emptyRepresentative);
    setStep(3);
    setMaxReached(3);
  };

  const startNew = () => {
    setHospital(emptyHospitalInfo);
    setRep(emptyRepresentative);
    setHospitalErrors({});
    setRepErrors({});
    setMaxReached(0);
    setStep(0);
  };

  const copy = STEP_COPY[step] ?? STEP_COPY[0];
  const complete = step === 3;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageBreadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "For Hospitals", to: "/for-hospitals" }, { label: "Apply to Join" }]}
      />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Hospital Application</h1>
      <p className="mt-2 text-muted-foreground">
        Apply to join the platform. This is a demonstration application and does not create a hospital account.
      </p>

      <div className="mt-8">
        <WizardStepper
          labels={APPLICATION_STEP_LABELS}
          ariaLabel="Application progress"
          step={step}
          maxReached={complete ? -1 : maxReached}
          onSelect={goTo}
        />
        <p className="sr-only" aria-live="polite">
          Step {step + 1} of {APPLICATION_STEP_LABELS.length}: {APPLICATION_STEP_LABELS[step]}
        </p>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-[17rem_1fr]">
        <aside className="hidden flex-col bg-sky p-6 lg:flex">
          <img src={illustration} alt="" aria-hidden className="h-36 w-full rounded-xl object-cover" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {step + 1} of {APPLICATION_STEP_LABELS.length}
          </p>
          <p className="mt-2 font-display text-xl font-extrabold leading-snug text-navy">{copy.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{SIDE_NOTES[step]}</p>
          <p className="mt-auto flex gap-2 pt-8 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-teal" aria-hidden />
            Submitting never grants access. A real application would need platform-owner verification and approval.
          </p>
        </aside>

        <div className="min-w-0 p-5 sm:p-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-extrabold tracking-tight text-navy outline-none sm:text-3xl"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{copy.desc}</p>

          <div className="mt-7">
            {step === 0 && (
              <HospitalInformationStep
                value={hospital}
                errors={hospitalErrors}
                onChange={(p) => setHospital((v) => ({ ...v, ...p }))}
                onContinue={continueHospital}
              />
            )}
            {step === 1 && (
              <RepresentativeInformationStep
                value={rep}
                errors={repErrors}
                onChange={(p) => setRep((v) => ({ ...v, ...p }))}
                onBack={() => show(0)}
                onContinue={continueRep}
              />
            )}
            {step === 2 && (
              <ApplicationReviewStep
                hospital={hospital}
                rep={rep}
                onEdit={(s) => show(s)}
                onBack={() => show(1)}
                onSubmit={submit}
              />
            )}
            {complete && <ApplicationCompleteStep onStartNew={startNew} />}
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Information entered here stays in this browser tab only and is discarded when you leave the page.
      </p>
    </div>
  );
}

export function HospitalApplicationPage() {
  return (
    <PublicPageShell>
      <HospitalApplicationWizard />
    </PublicPageShell>
  );
}
