import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FormField, InformationNotice, PasswordInput, passwordStrength } from "@/components/register/fields";
import {
  checkDemoCode,
  maskPhone,
  DEMO_CODE,
  DEMO_CODE_TTL_SECONDS,
  type FieldErrors,
} from "@/components/register/validation";
import type { NewPasswordDetails, RecoveryPhone } from "./recovery-validation";

/** Step 1 — enter the phone number associated with the account. */
export function RecoveryPhoneStep({
  value,
  errors,
  onChange,
  onContinue,
}: {
  value: RecoveryPhone;
  errors: FieldErrors<RecoveryPhone>;
  onChange: (patch: Partial<RecoveryPhone>) => void;
  onContinue: () => void;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-5"
    >
      <FormField
        label="Phone Number"
        error={errors.phone}
        description="We check the format only — this demo never reveals whether a number belongs to an account."
      >
        {({ id, describedBy, invalid }) => (
          <div className="flex gap-2">
            <span
              aria-hidden
              className="grid h-11 shrink-0 place-items-center rounded-md border border-input bg-muted px-3 text-sm font-semibold text-foreground"
            >
              +251
            </span>
            <Input
              id={id}
              type="tel"
              inputMode="tel"
              value={value.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="0911 234 567"
              autoComplete="tel-national"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11 min-w-0"
            />
          </div>
        )}
      </FormField>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="h-11">
          <Link to="/login">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Log In
          </Link>
        </Button>
        <Button type="submit" className="h-11 px-8">
          Continue <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}

/** Step 2 — simulated six-digit verification code. */
export function DemoVerificationStep({
  phone,
  onChangePhone,
  onBack,
  onVerified,
}: {
  phone: string; // normalized 9-digit local number
  onChangePhone: () => void;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DEMO_CODE_TTL_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const expired = secondsLeft <= 0;

  const verify = (value: string = code) => {
    const result = checkDemoCode(value, expired);
    switch (result) {
      case "empty":
        setError("Enter the 6-digit demonstration code.");
        break;
      case "incomplete":
        setError("The code has 6 digits — please enter all of them.");
        break;
      case "expired":
        setError("This demo code has expired. Use Resend Demo Code to restart the timer.");
        break;
      case "incorrect":
        setError("That code doesn't match. In this demo the code is 123456.");
        break;
      case "ok":
        setError(null);
        onVerified();
    }
  };

  const resend = () => {
    setSecondsLeft(DEMO_CODE_TTL_SECONDS);
    setCode("");
    setError(null);
    setResent(true);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-accent p-4 text-sm text-accent-foreground">
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4" aria-hidden /> Demo mode
        </p>
        <p className="mt-1 leading-relaxed">
          No SMS has been sent. Enter <strong className="tracking-widest">{DEMO_CODE}</strong> to continue.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        We would send a 6-digit code to <span className="font-semibold text-foreground">{maskPhone(phone)}</span>.{" "}
        <button
          type="button"
          onClick={onChangePhone}
          className="font-semibold text-primary underline underline-offset-2"
        >
          Change phone number
        </button>
      </p>

      <div className="space-y-2">
        <label htmlFor="recovery-otp" className="text-sm font-semibold text-navy">
          Verification code <span className="text-destructive" aria-hidden>*</span>
        </label>
        <InputOTP
          id="recovery-otp"
          maxLength={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(null);
          }}
          onComplete={(v) => verify(v)}
          inputMode="numeric"
          autoComplete="one-time-code"
          containerClassName="justify-start"
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-12 w-11 text-base" />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {expired ? "Demo code expired." : `Demo code expires in ${secondsLeft}s.`}
          {resent && !expired && " Demo timer reset — no SMS was sent."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="button" variant="ghost" onClick={onBack} className="h-11">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </Button>
          <Button type="button" variant="ghost" onClick={resend} className="h-11">
            Resend Demo Code
          </Button>
        </div>
        <Button type="button" onClick={() => verify()} className="h-11 px-8">
          Verify Code
        </Button>
      </div>
    </div>
  );
}

/** Step 3 — choose a new password (preview only; nothing is stored). */
export function NewPasswordStep({
  value,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  value: NewPasswordDetails;
  errors: FieldErrors<NewPasswordDetails>;
  onChange: (patch: Partial<NewPasswordDetails>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const strength = passwordStrength(value.password);
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-5"
    >
      <FormField
        label="New Password"
        error={errors.password}
        description="Use at least 12 characters. A longer passphrase is easier to remember and harder to guess."
      >
        {({ id, describedBy, invalid }) => (
          <>
            <PasswordInput
              id={id}
              describedBy={describedBy}
              invalid={invalid}
              value={value.password}
              onChange={(v) => onChange({ password: v })}
              placeholder="Create a new password"
              autoComplete="new-password"
            />
            {strength && !errors.password && (
              <p className={`text-xs font-medium ${strength.cls}`} aria-live="polite">
                {strength.label}
              </p>
            )}
          </>
        )}
      </FormField>

      <FormField label="Confirm New Password" error={errors.confirmPassword}>
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            describedBy={describedBy}
            invalid={invalid}
            value={value.confirmPassword}
            onChange={(v) => onChange({ confirmPassword: v })}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />
        )}
      </FormField>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="h-11">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Button>
        <Button type="submit" className="h-11 px-6">
          Preview Password Reset <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}

/** Step 4 — recovery preview complete. */
export function RecoveryCompleteStep({ onStartAgain }: { onStartAgain: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-soft">
        <CheckCircle2 className="h-9 w-9 text-teal" aria-hidden />
      </div>
      <p className="text-muted-foreground">
        You have completed the demonstration password recovery process.
      </p>
      <InformationNotice title="This is a frontend demonstration.">
        <p>No real account was accessed and no password was changed.</p>
      </InformationNotice>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="h-11 px-8">
          <Link to="/login">Return to Log In</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onStartAgain} className="h-11 px-8">
          Start Again
        </Button>
      </div>
    </div>
  );
}
