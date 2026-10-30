import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { NavLink } from "@/components/home/coming-soon";
import { routes } from "@/config/navigation";
import { FormField, InformationNotice, PasswordInput, passwordStrength } from "./fields";
import {
  checkDemoCode,
  maskPhone,
  normalizeEthiopianPhone,
  DEMO_CODE,
  DEMO_CODE_TTL_SECONDS,
  type AccountDetails,
  type FieldErrors,
} from "./validation";

export function AccountSetupStep({
  value,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  value: AccountDetails;
  errors: FieldErrors<AccountDetails>;
  onChange: (patch: Partial<AccountDetails>) => void;
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
        label="Phone Number"
        error={errors.phone}
        description="Used for appointment reminders once the service is live."
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
              className="h-11"
            />
          </div>
        )}
      </FormField>

      <FormField label="Email Address" required={false} optional error={errors.email}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="email"
            inputMode="email"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@example.com"
            autoComplete="email"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <FormField
        label="Password"
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
              placeholder="Create a password"
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

      <FormField label="Confirm Password" error={errors.confirmPassword}>
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            describedBy={describedBy}
            invalid={invalid}
            value={value.confirmPassword}
            onChange={(v) => onChange({ confirmPassword: v })}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        )}
      </FormField>

      <InformationNotice title="Your privacy">
        <p>
          This prototype stores nothing: your details stay in this browser tab and disappear when you leave.
          When the service launches, account use will be covered by our{" "}
          <NavLink target={{ ...routes.register, label: "Privacy Policy", href: "/privacy", implemented: false }} className="font-semibold underline underline-offset-2" />{" "}
          and{" "}
          <NavLink target={{ ...routes.register, label: "Terms of Service", href: "/terms", implemented: false }} className="font-semibold underline underline-offset-2" />.
        </p>
      </InformationNotice>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="h-11">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Button>
        <Button type="submit" className="h-11 px-6">
          Continue to Phone Verification <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}

/** Simulated phone verification — a sub-state of Step 3, not a fifth step. */
export function DemoPhoneVerification({
  phone,
  onEditPhone,
  onVerified,
}: {
  phone: string; // normalized 9-digit local number
  onEditPhone: () => void;
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
        setError("This demo code has expired. Use Resend Code to restart the timer.");
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
          No SMS will be sent. Use code <strong className="tracking-widest">{DEMO_CODE}</strong> to preview the
          verification experience.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        We would send a 6-digit code to <span className="font-semibold text-foreground">{maskPhone(phone)}</span>.{" "}
        <button type="button" onClick={onEditPhone} className="font-semibold text-primary underline underline-offset-2">
          Edit phone number
        </button>
      </p>

      <div className="space-y-2">
        <label htmlFor="demo-otp" className="text-sm font-semibold text-navy">
          Verification code <span className="text-destructive" aria-hidden>*</span>
        </label>
        <InputOTP
          id="demo-otp"
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
          {expired
            ? "Demo code expired."
            : `Demo code expires in ${secondsLeft}s.`}
          {resent && !expired && " New demo timer started — no SMS was sent."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={resend} className="h-11">
          Resend Code
        </Button>
        <Button type="button" onClick={verify} className="h-11 px-8">
          Verify Code
        </Button>
      </div>
    </div>
  );
}

export { normalizeEthiopianPhone };
