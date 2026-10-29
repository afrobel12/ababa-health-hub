import { createContext, useContext, useState, type ReactNode } from "react";
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

const Ctx = createContext<(t: NavTarget) => void>(() => {});

export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<NavTarget | null>(null);
  return (
    <Ctx.Provider value={setTarget}>
      {children}
      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
              <Construction className="h-5 w-5" aria-hidden />
            </div>
            <DialogTitle>{target?.label}</DialogTitle>
            <DialogDescription>This page is coming in a future design phase.</DialogDescription>
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
  "aria-current"?: "page";
}) {
  const open = useComingSoon();
  if (target.implemented) {
    return (
      <Link to="/" className={className} onClick={onSelect} {...rest}>
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
