import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ inverted, compact }: { inverted?: boolean; compact?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center">
        <Heart className="h-10 w-10 fill-teal text-teal" strokeWidth={1.5} aria-hidden />
        <Plus
          className={cn("absolute h-4 w-4", inverted ? "text-navy" : "text-primary-foreground")}
          strokeWidth={3.5}
          aria-hidden
        />
      </span>
      <span
        className={cn(
          "font-display font-bold leading-tight",
          compact ? "text-xs" : "text-sm sm:text-base",
          inverted ? "text-navy-foreground" : "text-navy",
        )}
      >
        Ethiopian Healthcare
        <br />
        Management System
      </span>
    </span>
  );
}
