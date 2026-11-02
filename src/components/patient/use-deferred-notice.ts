import { useCallback, useRef } from "react";
import { useComingSoon } from "@/components/home/coming-soon";
import type { NavTarget } from "@/config/navigation";

/**
 * Opens the future-page notice only after a menu/sheet/popover has finished
 * closing and returned focus to its trigger, so the notice then restores focus
 * to that trigger and two modal layers never overlap.
 * Usage: call `queue(target)` on select, then `flush()` from onCloseAutoFocus.
 */
export function useDeferredNotice() {
  const open = useComingSoon();
  const pending = useRef<NavTarget | null>(null);
  const queue = useCallback((t: NavTarget) => {
    pending.current = t;
  }, []);
  const flush = useCallback(() => {
    const t = pending.current;
    pending.current = null;
    if (t) setTimeout(() => open(t), 0);
  }, [open]);
  return { queue, flush };
}
