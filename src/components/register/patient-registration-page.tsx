import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, HeartPulse } from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import { Brand } from "@/components/home/brand";
import { ComingSoonProvider, NavLink } from "@/components/home/coming-soon";
import { routes } from "@/config/navigation";
import { RegistrationStepper, STEP_LABELS } from "./stepper";
import { PersonalDetailsStep } from "./personal-details-step";
import { IdentityDetailsStep } from "./identity-details-step";
import { AccountSetupStep, DemoPhoneVerification } from "./account-setup-step";
import { RegistrationSuccess } from "./success-step";
import {
  normalizeEthiopianPhone,
  validateAccount,
  validateIdentity,
  validatePersonal,
  isUnderage,
  type AccountDetails,
  type FieldErrors,
  type IdentityDetails,
  type PersonalDetails,
} from "./validation";

const STEP_TITLES = [
  { title: "Tell us about yourself", desc: "Enter your personal information as it appears on your identification document." },
  { title: "Identity information", desc: "Provide the identification details used for your patient registration." },
  { title: "Secure your account", desc: "Add your phone number and create a password." },
  { title: "Registration preview complete!", desc: "You've successfully completed the demonstration registration process." },
] as const;

const emptyPersonal: PersonalDetails = { firstName: "", middleName: "", surname: "", dob: "", gender: "" };
const emptyIdentity: IdentityDetails = { nationalId: "" };
const emptyAccount: AccountDetails = { phone: "", email: "", password: "", confirmPassword: "" };

export function PatientRegistrationPage() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [verifying, setVerifying] = useState(false); // Step 3 sub-state
  const [personal, setPersonal] = useState(emptyPersonal);
  const [identity, setIdentity] = useState(emptyIdentity);
  const [account, setAccount] = useState(emptyAccount);
  const [personalErrors, setPersonalErrors] = useState<FieldErrors<PersonalDetails>>({});
  const [identityErrors, setIdentityErrors] = useState<FieldErrors<IdentityDetails>>({});
  const [accountErrors, setAccountErrors] = useState<FieldErrors<AccountDetails>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the step heading whenever the visible step changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, verifying]);

  const goTo = (next: number) => {
    setVerifying(false);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  const continuePersonal = () => {
    const errs = validatePersonal(personal);
    setPersonalErrors(errs);
    if (Object.keys(errs).length > 0 || isUnderage(personal)) return;
    goTo(1);
  };

  const continueIdentity = () => {
    const errs = validateIdentity(identity);
    setIdentityErrors(errs);
    if (Object.keys(errs).length > 0) return;
    goTo(2);
  };

  const continueAccount = () => {
    const errs = validateAccount(account);
    setAccountErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setVerifying(true);
  };

  const startAgain = () => {
    setPersonal(emptyPersonal);
    setIdentity(emptyIdentity);
    setAccount(emptyAccount);
    setPersonalErrors({});
    setIdentityErrors({});
    setAccountErrors({});
    setVerifying(false);
    setStep(0);
    setMaxReached(0);
  };

  const normalizedPhone = normalizeEthiopianPhone(account.phone) ?? "";
  const heading: { title: string; desc: string } = verifying
    ? { title: "Verify your phone number", desc: "Enter the demonstration code to preview verification." }
    : (STEP_TITLES[step] ?? STEP_TITLES[0]);

  return (
    <ComingSoonProvider>
      <div className="flex min-h-screen flex-col bg-background lg:flex-row">
        {/* Desktop brand panel */}
        <aside className="relative hidden overflow-hidden bg-navy text-navy-foreground lg:flex lg:w-[42%] lg:flex-col">
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy" aria-hidden />
          <div className="relative flex h-full flex-col p-10 xl:p-14">
            <Link to="/" aria-label="Ethiopian Healthcare Management System home">
              <Brand inverted />
            </Link>
            <div className="mt-auto max-w-md">
              <HeartPulse className="h-10 w-10 text-teal" aria-hidden />
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight xl:text-[2.75rem]">
                Your healthcare, one account.
              </h1>
              <p className="mt-4 text-lg leading-relaxed opacity-90">
                Create your patient account to manage hospital appointments and access your healthcare information.
              </p>
              <p className="mt-6 rounded-lg border border-navy-foreground/20 bg-navy-foreground/5 p-4 text-sm leading-relaxed opacity-80">
                This is a design prototype: it does not create real accounts, verify identities, or send messages.
              </p>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <div className="flex flex-1 flex-col">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
            <Link to="/" aria-label="Ethiopian Healthcare Management System home">
              <Brand compact />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Home
            </Link>
          </div>

          <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-8 sm:px-6 lg:justify-center lg:py-12">
            <RegistrationStepper step={step} maxReached={maxReached} onSelect={goTo} />

            <div className="mt-8">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-2xl font-extrabold tracking-tight text-navy outline-none sm:text-3xl"
              >
                {heading.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{heading.desc}</p>
              {step === 0 && (
                <p className="mt-2 text-sm">
                  Already have an account?{" "}
                  <NavLink target={routes.login} className="font-semibold text-primary underline underline-offset-2" />
                </p>
              )}
            </div>

            <div className="mt-7">
              {step === 0 && (
                <PersonalDetailsStep
                  value={personal}
                  errors={personalErrors}
                  onChange={(p) => setPersonal((v) => ({ ...v, ...p }))}
                  onContinue={continuePersonal}
                />
              )}
              {step === 1 && (
                <IdentityDetailsStep
                  value={identity}
                  errors={identityErrors}
                  onChange={(p) => setIdentity((v) => ({ ...v, ...p }))}
                  onBack={() => goTo(0)}
                  onContinue={continueIdentity}
                />
              )}
              {step === 2 &&
                (verifying ? (
                  <DemoPhoneVerification
                    phone={normalizedPhone}
                    onEditPhone={() => setVerifying(false)}
                    onVerified={() => goTo(3)}
                  />
                ) : (
                  <AccountSetupStep
                    value={account}
                    errors={accountErrors}
                    onChange={(p) => setAccount((v) => ({ ...v, ...p }))}
                    onBack={() => goTo(1)}
                    onContinue={continueAccount}
                  />
                ))}
              {step === 3 && (
                <RegistrationSuccess
                  firstName={personal.firstName}
                  phone={normalizedPhone}
                  onStartAgain={startAgain}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </ComingSoonProvider>
  );
}
