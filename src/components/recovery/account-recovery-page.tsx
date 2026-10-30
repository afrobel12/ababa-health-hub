import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/home/brand";
import { WizardStepper } from "@/components/register/stepper";
import { normalizeEthiopianPhone, type FieldErrors } from "@/components/register/validation";
import {
  RECOVERY_STEP_LABELS,
  validateNewPassword,
  validateRecoveryPhone,
  type NewPasswordDetails,
  type RecoveryPhone,
} from "./recovery-validation";
import {
  DemoVerificationStep,
  NewPasswordStep,
  RecoveryCompleteStep,
  RecoveryPhoneStep,
} from "./recovery-steps";

const STEP_TITLES = [
  { title: "Forgot your password?", desc: "Enter the phone number associated with your account to begin recovery." },
  { title: "Verify your phone number", desc: "Enter the six-digit demonstration verification code." },
  { title: "Create a new password", desc: "Choose a password for your account." },
  { title: "Recovery preview complete!", desc: "You have completed the demonstration password recovery process." },
] as const;

const emptyPhone: RecoveryPhone = { phone: "" };
const emptyPassword: NewPasswordDetails = { password: "", confirmPassword: "" };

export function AccountRecoveryPage() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [phone, setPhone] = useState(emptyPhone);
  const [passwords, setPasswords] = useState(emptyPassword);
  const [phoneErrors, setPhoneErrors] = useState<FieldErrors<RecoveryPhone>>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors<NewPasswordDetails>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the step heading whenever the visible step changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: number) => {
    // Never carry password state backwards or forwards out of Step 3.
    if (next !== 2) setPasswords(emptyPassword);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  const continuePhone = () => {
    const errs = validateRecoveryPhone(phone);
    setPhoneErrors(errs);
    if (Object.keys(errs).length > 0) return;
    goTo(1);
  };

  const continuePassword = () => {
    const errs = validateNewPassword(passwords);
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;
    goTo(3);
  };

  const startAgain = () => {
    setPhone(emptyPhone);
    setPasswords(emptyPassword);
    setPhoneErrors({});
    setPasswordErrors({});
    setStep(0);
    setMaxReached(0);
  };

  const normalizedPhone = normalizeEthiopianPhone(phone.phone) ?? "";
  const heading = STEP_TITLES[step] ?? STEP_TITLES[0];

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Desktop informational panel */}
      <aside className="relative hidden overflow-hidden bg-navy text-navy-foreground lg:flex lg:w-[42%] lg:flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/85 to-navy"
          aria-hidden
        />
        <div className="relative flex h-full flex-col p-10 xl:p-14">
          <Link to="/" aria-label="Ethiopian Healthcare Management System home">
            <Brand inverted />
          </Link>
          <div className="mt-auto max-w-md">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-navy-foreground/20 bg-navy-foreground/5">
              <ShieldCheck className="h-8 w-8 text-teal" aria-hidden />
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight xl:text-[2.75rem]">
              Recover your account securely.
            </h1>
            <p className="mt-4 text-lg leading-relaxed opacity-90">
              Follow a few simple steps to return to your healthcare workspace.
            </p>
            <p className="mt-6 rounded-lg border border-navy-foreground/20 bg-navy-foreground/5 p-4 text-sm leading-relaxed opacity-80">
              This is a design prototype: it does not access real accounts, send messages, or change passwords.
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Link to="/" aria-label="Ethiopian Healthcare Management System home">
            <Brand compact />
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Log In
          </Link>
        </div>

        <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-8 sm:px-6 lg:justify-center lg:py-12">
          <WizardStepper
            labels={RECOVERY_STEP_LABELS}
            ariaLabel="Account recovery progress"
            step={step}
            maxReached={maxReached}
            onSelect={goTo}
          />

          <div className="mt-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-2xl font-extrabold tracking-tight text-navy outline-none sm:text-3xl"
            >
              {heading.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{heading.desc}</p>
          </div>

          <div className="mt-7">
            {step === 0 && (
              <RecoveryPhoneStep
                value={phone}
                errors={phoneErrors}
                onChange={(p) => setPhone((v) => ({ ...v, ...p }))}
                onContinue={continuePhone}
              />
            )}
            {step === 1 && (
              <DemoVerificationStep
                phone={normalizedPhone}
                onChangePhone={() => goTo(0)}
                onBack={() => goTo(0)}
                onVerified={() => goTo(2)}
              />
            )}
            {step === 2 && (
              <NewPasswordStep
                value={passwords}
                errors={passwordErrors}
                onChange={(p) => setPasswords((v) => ({ ...v, ...p }))}
                onBack={() => goTo(1)}
                onContinue={continuePassword}
              />
            )}
            {step === 3 && <RecoveryCompleteStep onStartAgain={startAgain} />}
          </div>
        </main>
      </div>
    </div>
  );
}
