import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEP_LABELS = [
  "Personal Details",
  "Identity Details",
  "Account Setup",
  "Complete",
] as const;

/**
 * Wizard progress. Desktop: horizontal numbered stepper; mobile: compact bar
 * with "Step X of N". Completed steps are clickable so users can revisit them;
 * future steps are not.
 */
export function WizardStepper({
  labels,
  ariaLabel,
  step,
  maxReached,
  onSelect,
}: {
  labels: readonly string[];
  ariaLabel: string;
  step: number; // 0-based current step
  maxReached: number; // furthest step reached
  onSelect: (step: number) => void;
}) {
  const total = labels.length;
  return (
    <div>
      {/* Mobile compact progress */}
      <div className="lg:hidden" aria-hidden>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-navy">{labels[step]}</p>
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {total}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop stepper */}
      <ol aria-label={ariaLabel} className="hidden lg:flex lg:items-center lg:gap-2">
        {labels.map((label, i) => {
          const done = i < step;
          const current = i === step;
          const reachable = i <= maxReached;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onSelect(i)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-md py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  reachable ? "cursor-pointer" : "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-bold",
                    done
                      ? "border-teal bg-teal text-teal-foreground"
                      : current
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "truncate text-xs font-semibold",
                    current ? "text-navy" : done ? "text-teal" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </button>
              {i < total - 1 && <span className={cn("h-px flex-1", done ? "bg-teal" : "bg-border")} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function RegistrationStepper({
  step,
  maxReached,
  onSelect,
}: {
  step: number;
  maxReached: number;
  onSelect: (step: number) => void;
}) {
  return (
    <WizardStepper
      labels={STEP_LABELS}
      ariaLabel="Registration progress"
      step={step}
      maxReached={maxReached}
      onSelect={onSelect}
    />
  );
}
