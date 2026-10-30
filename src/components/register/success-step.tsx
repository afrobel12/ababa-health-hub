import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { maskPhone } from "./validation";

export function RegistrationSuccess({
  firstName,
  phone,
  onStartAgain,
}: {
  firstName: string;
  phone: string; // normalized 9-digit local number
  onStartAgain: () => void;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-soft">
        <CheckCircle2 className="h-9 w-9 text-teal" aria-hidden />
      </div>
      <p className="text-muted-foreground">
        Well done{firstName.trim() ? `, ${firstName.trim()}` : ""}. You've successfully completed the demonstration
        registration process for <span className="font-semibold text-foreground">{maskPhone(phone)}</span>.
      </p>
      <div className="rounded-lg border border-border bg-accent p-4 text-left text-sm leading-relaxed text-accent-foreground">
        <p className="font-semibold">This is a frontend demonstration.</p>
        <p className="mt-1">
          No account has been created and no information has been submitted to a healthcare provider.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="h-11 px-8">
          <Link to="/">Return to Homepage</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onStartAgain} className="h-11 px-8">
          Start Again
        </Button>
      </div>
    </div>
  );
}
