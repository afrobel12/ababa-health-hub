// Demo-only reschedule and cancel dialogs. They update the shared in-memory
// appointment state; no hospital, SMS, email or calendar is involved.
import { useMemo, useRef, useState, type ReactElement } from "react";
import { AlertTriangle, CalendarClock, CalendarDays, Check, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addisInstant, rescheduleDateKeys, rescheduleSlots, type DemoSlot } from "@/data/patient-appointments";
import { formatDate, formatTime, type Appointment } from "@/data/patient-demo";
import { cn } from "@/lib/utils";
import { usePatientAppointments } from "./appointments-provider";

export const RESCHEDULE_SUCCESS = "Demo appointment rescheduled. No real hospital booking was changed.";
export const CANCEL_SUCCESS = "Demo appointment cancelled. No real hospital booking was changed.";

/**
 * Radix returns focus to the trigger, but after a change the trigger can
 * disappear (e.g. a cancelled card moves to Past). Then focus `fallbackId`.
 */
function useFocusReturn(fallbackId: string) {
  const opener = useRef<HTMLElement | null>(null);
  return {
    remember: () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus: (e: Event) => {
      if (opener.current?.isConnected) return;
      e.preventDefault();
      document.getElementById(fallbackId)?.focus();
    },
  };
}

function AppointmentSummaryBox({ appointment: a, label }: { appointment: Appointment; label: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/40 p-3 text-sm" aria-label={label} role="group">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
        <CalendarDays className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-mono font-bold text-navy">{a.bookingReference}</p>
        <p className="text-foreground">
          {a.hospital.name} · {a.department}
        </p>
        {a.doctor && <p className="text-muted-foreground">{a.doctor.displayName}</p>}
        <p className="text-foreground">
          {formatDate(a.appointmentDateTime)} · {formatTime(a.appointmentDateTime)}
        </p>
      </div>
    </div>
  );
}

const keyToLocal = (key: string) => {
  const [y, m, d] = key.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};
const pad = (n: number) => String(n).padStart(2, "0");
const localToKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const SLOT_NOTE: Record<DemoSlot["state"], string> = {
  available: "",
  current: "current appointment time",
  clash: "you have another appointment then",
  "too-soon": "less than 24 hours away",
};

export function RescheduleAppointmentDialog({
  appointment,
  trigger,
  fallbackFocusId,
}: {
  appointment: Appointment;
  trigger: ReactElement;
  fallbackFocusId: string;
}) {
  const { appointments, now, rescheduleDemoAppointment } = usePatientAppointments();
  const [open, setOpen] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const focus = useFocusReturn(fallbackFocusId);

  const dateKeys = useMemo(
    () => (open && appointments && now ? rescheduleDateKeys(appointments, appointment, now) : []),
    [open, appointments, appointment, now],
  );
  const allowed = useMemo(() => new Set(dateKeys), [dateKeys]);
  const slots = appointments && now && dateKey ? rescheduleSlots(appointments, appointment, dateKey, now) : [];

  const onOpenChange = (next: boolean) => {
    if (next) {
      focus.remember();
      setDateKey("");
      setTime("");
      setError(null);
    }
    setOpen(next);
  };

  const confirm = () => {
    if (!dateKey || !time) {
      setError(!dateKey ? "Choose a new date." : "Choose a new time.");
      return;
    }
    const [hh, mm] = time.split(":").map(Number) as [number, number];
    const result = rescheduleDemoAppointment(appointment.id, addisInstant(dateKey, hh, mm));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOpen(false);
    toast.success(RESCHEDULE_SUCCESS);
  };

  const first = dateKeys[0];
  const last = dateKeys.at(-1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto" onCloseAutoFocus={focus.onCloseAutoFocus}>
        <DialogHeader className="flex-row items-start gap-3 space-y-0 text-left">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div className="space-y-1">
            <DialogTitle className="font-display text-xl font-bold text-navy">Reschedule Appointment</DialogTitle>
            <DialogDescription>Choose a new appointment date and time.</DialogDescription>
          </div>
        </DialogHeader>

        <p className="flex gap-2 rounded-lg border border-primary/20 bg-accent p-3 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>
            <strong>Frontend Demonstration Only</strong> — No real hospital appointment will change. Times shown are sample slots, not real availability.
          </span>
        </p>

        <AppointmentSummaryBox appointment={appointment} label="Current appointment" />

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="space-y-2">
            <Label htmlFor={`resched-date-${appointment.id}`} className="font-semibold text-navy">
              Select New Date
            </Label>
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={`resched-date-${appointment.id}`}
                  variant="outline"
                  className={cn("h-11 w-full justify-start gap-2 font-normal", !dateKey && "text-muted-foreground")}
                  aria-describedby={`resched-date-hint-${appointment.id}`}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  {dateKey ? formatDate(addisInstant(dateKey, 12, 0)) : "Choose a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateKey ? keyToLocal(dateKey) : undefined}
                  defaultMonth={first ? keyToLocal(first) : undefined}
                  startMonth={first ? keyToLocal(first) : undefined}
                  endMonth={last ? keyToLocal(last) : undefined}
                  disabled={(d) => !allowed.has(localToKey(d))}
                  onSelect={(d) => {
                    if (!d) return;
                    setDateKey(localToKey(d));
                    setTime("");
                    setError(null);
                    setPickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <p id={`resched-date-hint-${appointment.id}`} className="text-xs text-muted-foreground">
              At least 24 hours from now, within the next 60 days. Addis Ababa time.
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-navy">
              Select New Time <span className="font-normal text-muted-foreground">(sample slots)</span>
            </legend>
            {!dateKey ? (
              <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">Choose a date to see times.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((s) => {
                  const selected = time === s.value;
                  const unavailable = s.state !== "available";
                  return (
                    <Button
                      key={s.value}
                      type="button"
                      variant={selected ? "teal" : "outline"}
                      className="h-11"
                      aria-pressed={selected}
                      disabled={unavailable}
                      aria-label={unavailable ? `${s.label}, unavailable: ${SLOT_NOTE[s.state]}` : s.label}
                      onClick={() => {
                        setTime(s.value);
                        setError(null);
                      }}
                    >
                      {selected && <Check aria-hidden />}
                      {s.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </fieldset>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="h-11 sm:flex-1" onClick={() => setOpen(false)}>
            Keep Current Appointment
          </Button>
          <Button variant="teal" className="h-11 sm:flex-1" onClick={confirm}>
            <Check aria-hidden /> Confirm Demo Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CancelAppointmentDialog({
  appointment,
  trigger,
  fallbackFocusId,
}: {
  appointment: Appointment;
  trigger: ReactElement;
  fallbackFocusId: string;
}) {
  const { cancelDemoAppointment } = usePatientAppointments();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const focus = useFocusReturn(fallbackFocusId);

  const confirm = () => {
    const result = cancelDemoAppointment(appointment.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOpen(false);
    toast.success(CANCEL_SUCCESS);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          focus.remember();
          setError(null);
        }
        setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto" onCloseAutoFocus={focus.onCloseAutoFocus}>
        <AlertDialogHeader className="flex-row items-start gap-3 space-y-0 text-left">
          <XCircle className="mt-0.5 h-8 w-8 shrink-0 text-destructive" aria-hidden />
          <div className="space-y-1">
            <AlertDialogTitle className="font-display text-xl font-bold text-navy">Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to cancel this demonstration appointment?</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AppointmentSummaryBox appointment={appointment} label="Appointment to cancel" />
        <p className="flex gap-2 rounded-lg border border-primary/20 bg-accent p-3 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>
            <strong>Cancellation Policy:</strong> Cancellation is available at least 24 hours before the appointment in this demonstration.
          </span>
        </p>
        <p className="flex gap-2 rounded-lg border border-warning-border bg-warning-soft p-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong>Frontend demonstration only</strong> — no real appointment will be cancelled.
          </span>
        </p>
        {error && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter className="gap-2 sm:gap-2 sm:space-x-0">
          <AlertDialogCancel className="mt-0 h-11 sm:flex-1">Keep Appointment</AlertDialogCancel>
          <Button variant="destructive" className="h-11 sm:flex-1" onClick={confirm}>
            Confirm Demo Cancellation
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
