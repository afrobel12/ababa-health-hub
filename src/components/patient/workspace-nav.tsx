import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { Brand } from "@/components/home/brand";
import { useComingSoon } from "@/components/home/coming-soon";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  futureTarget,
  isPatientNavActive,
  patientBottomNav,
  patientMoreNav,
  patientPrimaryNav,
  patientUtilityNav,
  type PatientNavItem,
} from "@/config/patient-navigation";
import { cn } from "@/lib/utils";
import { useDeferredNotice } from "./use-deferred-notice";

const usePathname = () => useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") || "/" });
const isItemActive = isPatientNavActive;

const sidebarItemCls = (active: boolean) =>
  cn(
    "relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
    active
      ? "bg-teal text-teal-foreground before:absolute before:inset-y-2 before:-left-3 before:w-1 before:rounded-r-full before:bg-teal-foreground"
      : "text-navy-foreground/80 hover:bg-navy-foreground/10 hover:text-navy-foreground",
  );

function SidebarEntry({ item, active }: { item: PatientNavItem; active: boolean }) {
  const open = useComingSoon();
  const Icon = item.icon;
  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      <span className="truncate">{item.label}</span>
    </>
  );
  if (item.to) {
    return (
      <Link to={item.to} className={sidebarItemCls(active)} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={sidebarItemCls(false)} onClick={() => open(futureTarget(item.label, item.plannedPath))}>
      {content}
    </button>
  );
}

export function PatientSidebar() {
  const pathname = usePathname();
  const navigate = useNavigate();
  return (
    <aside className="hidden bg-navy text-navy-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
      <div className="border-b border-navy-foreground/10 px-5 py-5">
        <Link to="/patient" aria-label="Patient Portal dashboard" className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-foreground">
          <Brand inverted compact />
        </Link>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-teal">Patient Portal</p>
      </div>
      <nav aria-label="Patient workspace" className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {patientPrimaryNav.map((item) => (
            <li key={item.id}>
              <SidebarEntry item={item} active={isItemActive(item, pathname)} />
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-navy-foreground/10 pt-4">
          <ul className="space-y-1">
            {patientUtilityNav.map((item) => (
              <li key={item.id}>
                <SidebarEntry item={item} active={false} />
              </li>
            ))}
            <li>
              <button
                type="button"
                className={sidebarItemCls(false)}
                aria-label="Log out of the demo workspace"
                onClick={() => navigate({ to: "/login" })}
              >
                <LogOut className="h-5 w-5 shrink-0" aria-hidden />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

const bottomItemCls = (active: boolean) =>
  cn(
    "flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active ? "text-teal" : "text-muted-foreground hover:text-foreground",
  );

export function PatientMobileBottomNav() {
  const pathname = usePathname();
  const open = useComingSoon();
  return (
    <nav
      aria-label="Patient workspace"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 px-1">
        {patientBottomNav.map((item) => {
          const Icon = item.mobileIcon ?? item.icon;
          const active = isItemActive(item, pathname);
          const label = item.mobileLabel ?? item.label;
          const inner = (
            <>
              <span className={cn("grid h-7 w-12 place-items-center rounded-full", active && "bg-teal-soft")}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="truncate">{label}</span>
            </>
          );
          return (
            <li key={item.id} className="min-w-0">
              {item.to ? (
                <Link to={item.to} className={bottomItemCls(active)} aria-current={active ? "page" : undefined}>
                  {inner}
                </Link>
              ) : (
                <button type="button" className={bottomItemCls(false)} onClick={() => open(futureTarget(item.label, item.plannedPath))}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
        <li className="min-w-0">
          <PatientMoreMenu />
        </li>
      </ul>
    </nav>
  );
}

export function PatientMoreMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { queue, flush } = useDeferredNotice();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={bottomItemCls(open)} aria-label="More navigation options">
          <span className={cn("grid h-7 w-12 place-items-center rounded-full", open && "bg-teal-soft")}>
            <Menu className="h-5 w-5" aria-hidden />
          </span>
          <span>More</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]" onCloseAutoFocus={flush}>
        <SheetHeader>
          <SheetTitle className="text-left">More</SheetTitle>
          <SheetDescription className="text-left">Demo workspace · fictional patient information</SheetDescription>
        </SheetHeader>
        <ul className="grid gap-1 px-4">
          {patientMoreNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    queue(futureTarget(item.label, item.plannedPath));
                    setOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  {item.label}
                </button>
              </li>
            );
          })}
          <li className="mt-2 border-t border-border pt-2">
            <button
              type="button"
              className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                setOpen(false);
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="h-5 w-5 text-primary" aria-hidden />
              Exit Demo Workspace
            </button>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
