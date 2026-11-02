import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, Globe, Info, LogOut, Settings, UserRound } from "lucide-react";
import { Brand } from "@/components/home/brand";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { futureTarget, pageLabelFor, patientNav } from "@/config/patient-navigation";
import { MOCK_PATIENT, UNREAD_NOTIFICATION_COUNT, buildNotifications, formatRelative } from "@/data/patient-demo";
import { useDemoNow } from "@/hooks/use-demo-now";
import { cn } from "@/lib/utils";
import { useDeferredNotice } from "./use-deferred-notice";

export const DEMO_EXPLANATION =
  "This patient workspace is a frontend demonstration. No real patient account has been authenticated and all medical information shown is fictional.";

export function PatientDemoIndicator({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-soft px-3 py-1 text-xs font-semibold text-warning",
        className,
      )}
    >
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        <span className="font-bold">Demo Mode</span> — Fictional patient information
      </span>
    </p>
  );
}

function Avatar({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-teal font-display font-bold text-teal-foreground",
        size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm",
      )}
    >
      {MOCK_PATIENT.initials}
    </span>
  );
}

export function NotificationBell() {
  const now = useDemoNow();
  const { queue, flush } = useDeferredNotice();
  const items = now ? buildNotifications(now).slice(0, 3) : [];
  const unread = UNREAD_NOTIFICATION_COUNT;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 && (
            <span aria-hidden className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-1.5rem))] p-0" onCloseAutoFocus={flush}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-display text-sm font-bold text-navy">Notifications</p>
          <span className="text-xs text-muted-foreground">{unread} unread · demo</span>
        </div>
        <ul className="divide-y divide-border">
          {items.map((n) => (
            <li key={n.id} className="flex gap-3 px-4 py-3">
              <span aria-hidden className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-border" : "bg-primary")} />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-foreground">
                  {n.title}
                  {!n.read && <span className="sr-only"> (unread)</span>}
                </p>
                <p className="mt-0.5 text-muted-foreground">{n.shortMessage}</p>
                <p className="mt-1 text-xs text-muted-foreground">{now && formatRelative(n.createdAt, now)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-2">
          <PopoverCloseAll onSelect={() => queue(futureTarget("Notifications", patientNav.notifications.plannedPath))} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Closes the popover (via Radix Close) after queuing the notice.
import { PopoverClose } from "@radix-ui/react-popover";
function PopoverCloseAll({ onSelect }: { onSelect: () => void }) {
  return (
    <PopoverClose asChild>
      <Button variant="ghost" className="h-10 w-full text-primary" onClick={onSelect}>
        View All
      </Button>
    </PopoverClose>
  );
}

export function PatientAccountMenu({ compact }: { compact?: boolean }) {
  const navigate = useNavigate();
  const { queue, flush } = useDeferredNotice();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${MOCK_PATIENT.displayName} (demo)`}
          className="flex min-h-10 items-center gap-2 rounded-full p-0.5 pr-2 text-sm font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar size={compact ? "sm" : "md"} />
          {!compact && <span className="hidden sm:inline">{MOCK_PATIENT.displayName}</span>}
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" onCloseAutoFocus={flush}>
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold text-foreground">{MOCK_PATIENT.displayName}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{DEMO_EXPLANATION}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => queue(futureTarget("My Profile", patientNav.profile.plannedPath))}>
          <UserRound aria-hidden /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => queue(futureTarget("Settings", patientNav.settings.plannedPath))}>
          <Settings aria-hidden /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/">
            <Globe aria-hidden /> Return to Public Website
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/login" })}>
          <LogOut aria-hidden /> Exit Demo Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PatientTopHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const page = pageLabelFor(pathname);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4 lg:h-16 lg:px-8">
        <Link to="/patient" aria-label="Patient Portal dashboard" className="flex min-w-0 items-center gap-2 lg:hidden">
          <span className="sr-only">Ethiopian Healthcare Management System</span>
          <span className="[&>span>span:last-child]:hidden">
            <Brand compact />
          </span>
          <span className="truncate font-display text-sm font-bold text-navy">Patient Portal</span>
        </Link>
        <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
          <span className="font-display font-bold text-navy">Patient Portal</span>
          <span aria-hidden className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{page}</span>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <PatientDemoIndicator className="hidden xl:inline-flex" />
          <NotificationBell />
          <span className="lg:hidden">
            <PatientAccountMenu compact />
          </span>
          <span className="hidden lg:inline">
            <PatientAccountMenu />
          </span>
        </div>
      </div>
    </header>
  );
}
