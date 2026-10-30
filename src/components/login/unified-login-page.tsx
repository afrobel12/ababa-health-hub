import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, ArrowRight, Building2, HeartPulse, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import { Brand } from "@/components/home/brand";
import { ComingSoonProvider, NavLink } from "@/components/home/coming-soon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InlineError, PasswordInput } from "@/components/register/fields";
import { routes } from "@/config/navigation";
import { demoProfiles, type DemoProfile } from "@/data/demo-accounts";
import { LIVE_SIGNIN_UNAVAILABLE, validateLogin, type LoginErrors } from "./login-validation";

const forgotPassword = { label: "Forgot Password", href: "/forgot-password", implemented: true };

export function UnifiedLoginPage() {
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [workspaceIdx, setWorkspaceIdx] = useState(0);

  return (
    <ComingSoonProvider>
      <LoginLayout>
        {profile ? (
          <DemoWorkspacePreview
            profile={profile}
            index={workspaceIdx}
            onSelectWorkspace={setWorkspaceIdx}
            onBack={() => setProfile(null)}
          />
        ) : (
          <>
            <LoginForm />
            <DemoAccountPanel
              onPreview={(p) => {
                setWorkspaceIdx(0);
                setProfile(p);
              }}
            />
          </>
        )}
      </LoginLayout>
    </ComingSoonProvider>
  );
}

function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="relative hidden overflow-hidden bg-navy text-navy-foreground md:flex md:w-[42%] md:flex-col">
        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy" aria-hidden />
        <div className="relative flex h-full flex-col p-8 xl:p-14">
          <Link to="/" aria-label="Ethiopian Healthcare Management System home">
            <Brand inverted />
          </Link>
          <div className="mt-auto max-w-md">
            <HeartPulse className="h-10 w-10 text-teal" aria-hidden />
            <p className="mt-5 font-display text-3xl font-extrabold leading-tight lg:text-4xl xl:text-[2.75rem]">
              Welcome back to better healthcare.
            </p>
            <p className="mt-4 text-lg leading-relaxed opacity-90">
              One connected platform for patients and healthcare professionals across Ethiopia.
            </p>
            <div className="mt-6 flex gap-3 rounded-lg border border-navy-foreground/20 bg-navy-foreground/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold">One platform. Protected workspaces.</p>
                <p className="mt-1 leading-relaxed opacity-80">
                  Patients and hospital staff sign in from the same place and land in their own workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Link to="/" aria-label="Ethiopian Healthcare Management System home">
            <Brand compact />
          </Link>
          <Link to="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Home
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 py-8 sm:px-6 md:justify-center md:py-12">
          <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
            Demo mode
          </span>
          {children}
        </main>
      </div>
    </div>
  );
}

function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [notice, setNotice] = useState(false);

  return (
    <section aria-labelledby="login-heading">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Welcome back</p>
      <h1 id="login-heading" className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
        Log in to your account
      </h1>
      <p className="mt-2 text-muted-foreground">Enter your phone number and password to continue.</p>

      <form
        noValidate
        className="mt-7 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const errs = validateLogin({ phone, password });
          setErrors(errs);
          setNotice(Object.keys(errs).length === 0);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="login-phone" className="text-sm font-semibold text-navy">
            Phone Number
          </Label>
          <PhoneNumberInput
            value={phone}
            onChange={(v) => {
              setPhone(v);
              setNotice(false);
            }}
            invalid={!!errors.phone}
          />
          <InlineError id="login-phone-err" message={errors.phone} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="login-password" className="text-sm font-semibold text-navy">
              Password
            </Label>
            <NavLink target={forgotPassword} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              Forgot password?
            </NavLink>
          </div>
          <PasswordInput
            id="login-password"
            describedBy={errors.password ? "login-password-err" : undefined}
            invalid={!!errors.password}
            value={password}
            onChange={(v) => {
              setPassword(v);
              setNotice(false);
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <InlineError id="login-password-err" message={errors.password} />
        </div>

        {notice && (
          <div role="alert" className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="leading-relaxed">{LIVE_SIGNIN_UNAVAILABLE}</p>
          </div>
        )}

        <Button type="submit" className="h-12 w-full text-base">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary underline underline-offset-2">
          Register
        </Link>
      </p>
    </section>
  );
}

function PhoneNumberInput({ value, onChange, invalid }: { value: string; onChange: (v: string) => void; invalid: boolean }) {
  return (
    <div className="flex gap-2">
      <span aria-hidden className="grid h-11 shrink-0 place-items-center rounded-md border border-input bg-muted px-3 text-sm font-semibold text-foreground">
        +251
      </span>
      <Input
        id="login-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="9XX XXX XXX"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={invalid ? "login-phone-err" : undefined}
        aria-invalid={invalid || undefined}
        className="h-11 min-w-0"
      />
    </div>
  );
}

function DemoAccountPanel({ onPreview }: { onPreview: (p: DemoProfile) => void }) {
  return (
    <section aria-labelledby="demo-heading" className="mt-8 rounded-xl border border-border bg-accent/50 p-4 sm:p-5">
      <h2 id="demo-heading" className="flex items-center gap-2 font-display text-base font-bold text-navy">
        <Users className="h-4 w-4 text-primary" aria-hidden /> Explore demo accounts
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fictional examples only. Previewing a workspace does not sign you in.
      </p>
      <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
        {demoProfiles.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.workspaces.map((w) => (w.hospital ? `${w.roleLabel} · ${w.hospital}` : w.roleLabel)).join(" / ")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10"
              onClick={() => onPreview(p)}
              aria-label={`Preview workspace for ${p.name}`}
            >
              Preview workspace
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DemoWorkspacePreview({
  profile,
  index,
  onSelectWorkspace,
  onBack,
}: {
  profile: DemoProfile;
  index: number;
  onSelectWorkspace: (i: number) => void;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), [profile.id]);
  const ws = profile.workspaces[index] ?? profile.workspaces[0]!;

  return (
    <section aria-labelledby="preview-heading">
      <h1 ref={headingRef} id="preview-heading" tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight text-navy outline-none sm:text-3xl">
        Workspace preview
      </h1>
      <p className="mt-3 flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Demo workspace preview — no account has been authenticated.
      </p>

      {profile.workspaces.length > 1 && (
        <WorkspaceSelector profile={profile} index={index} onSelect={onSelectWorkspace} />
      )}

      <dl className="mt-6 space-y-4 rounded-xl border border-border bg-card p-5 shadow-card" aria-live="polite">
        <PreviewRow icon={<Users className="h-4 w-4" />} term="Selected role" detail={ws.roleLabel} />
        <PreviewRow icon={<Building2 className="h-4 w-4" />} term="Hospital membership" detail={ws.hospital ?? "Not linked to a hospital"} />
        <PreviewRow icon={<LayoutDashboard className="h-4 w-4" />} term="Would open" detail={ws.destination} />
        <div className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{ws.description}</div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        The {ws.destination} is planned for a future design phase and has not been built.
      </p>

      <Button type="button" variant="ghost" onClick={onBack} className="mt-6 h-11">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to log in
      </Button>
    </section>
  );
}

function WorkspaceSelector({ profile, index, onSelect }: { profile: DemoProfile; index: number; onSelect: (i: number) => void }) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold text-navy">Choose a workspace</legend>
      <p className="text-xs text-muted-foreground">This demo user belongs to {profile.workspaces.length} fictional workspaces.</p>
      <div role="radiogroup" className="mt-3 grid gap-2">
        {profile.workspaces.map((w, i) => (
          <label
            key={`${w.role}-${w.hospital}`}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring ${
              i === index ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <input type="radio" name="workspace" checked={i === index} onChange={() => onSelect(i)} className="h-4 w-4 accent-primary" />
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">{w.roleLabel}</span>
              <span className="block text-xs text-muted-foreground">{w.hospital}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PreviewRow({ icon, term, detail }: { icon: ReactNode; term: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-primary" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{term}</dt>
        <dd className="font-semibold text-foreground">{detail}</dd>
      </div>
    </div>
  );
}
