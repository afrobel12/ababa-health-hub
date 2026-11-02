import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Construction } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { NavTarget } from "@/config/navigation";

type AppPath =
  | "/"
  | "/register"
  | "/login"
  | "/forgot-password"
  | "/hospitals"
  | "/for-hospitals"
  | "/for-hospitals/apply"
  | "/about"
  | "/contact"
  | "/privacy"
  | "/terms"
  | "/patient";

const Ctx = createContext<(t: NavTarget) => void>(() => {});

export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<NavTarget | null>(null);
  // The notice has no Radix trigger, so remember what opened it and return focus there.
  const returnFocus = useRef<HTMLElement | null>(null);
  const open = useCallback((t: NavTarget) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setTarget(t);
  }, []);
  return (
    <Ctx.Provider value={open}>
      {children}
      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            const el = returnFocus.current;
            returnFocus.current = null;
            if (el?.isConnected) {
              e.preventDefault();
              el.focus();
            }
          }}
        >
          <DialogHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
              <Construction className="h-5 w-5" aria-hidden />
            </div>
            <DialogTitle>{target?.label}</DialogTitle>
            <DialogDescription>{target?.notice ?? "This page is coming in a future design phase."}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setTarget(null)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

export const useComingSoon = () => useContext(Ctx);

/** Link that navigates for built pages and opens the notice otherwise. */
export function NavLink({
  target,
  className,
  children,
  onSelect,
  ...rest
}: {
  target: NavTarget;
  className?: string;
  children?: ReactNode;
  onSelect?: () => void;
  "aria-current"?: "page" | undefined;
}) {
  const open = useComingSoon();
  if (target.implemented) {
    return (
      <Link to={target.href as AppPath} {...(target.hash ? { hash: target.hash } : {})} className={className} onClick={onSelect} {...rest}>
        {children ?? target.label}
      </Link>
    );
  }
  return (
    <a
      href={target.href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onSelect?.();
        open(target);
      }}
      {...rest}
    >
      {children ?? target.label}
    </a>
  );
}
