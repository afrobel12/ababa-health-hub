import { useId, useState, type ReactNode } from "react";
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function InlineError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

/** Labelled field wrapper with required marker, description and inline error wiring. */
export function FormField({
  label,
  required = true,
  optional = false,
  description,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  description?: string | undefined;
  error?: string | undefined;
  children: (ids: { id: string; describedBy?: string | undefined; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {description && (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {children({ id, describedBy, invalid: !!error })}
      <InlineError id={errId ?? `${id}-err`} message={error} />
    </div>
  );
}

export function PasswordInput({
  id,
  describedBy,
  invalid,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  describedBy?: string | undefined;
  invalid: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="h-11 pr-11"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}

/** Length-based password strength hint (prototype guidance only). */
export function passwordStrength(pw: string): { label: string; cls: string } | null {
  if (!pw) return null;
  if (pw.length < 12) return { label: "Too short — use at least 12 characters", cls: "text-destructive" };
  if (pw.length < 16) return { label: "Good length — longer is even better", cls: "text-teal" };
  return { label: "Strong length", cls: "text-teal" };
}

export function InformationNotice({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        tone === "info" ? "border-border bg-accent text-accent-foreground" : "border-amber-300 bg-amber-50 text-amber-900",
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="text-sm">
        <p className="font-semibold">{title}</p>
        <div className="mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
