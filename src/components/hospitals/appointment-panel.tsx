import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Hospital } from "@/data/hospitals";
import { canPreview, demoDateWindow, demoSlots, doctorsFor, localDateKey, parseLocalDate, timeLabel, type AppointmentSelection } from "@/data/hospital-details";

export function HospitalAppointmentPanel({ hospital, selection, now, onDepartment, onDoctor, onDate, onTime }: {
  hospital: Hospital; selection: AppointmentSelection; now: Date | null;
  onDepartment: (department: string) => void; onDoctor: (doctor: string) => void; onDate: (date: string) => void; onTime: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);
  const doctors = doctorsFor(hospital.id, selection.department);
  const selectedDoctor = doctors.find((d) => d.id === selection.doctorId);
  const slots = now ? demoSlots(hospital, selection, now) : [];
  const window = now ? demoDateWindow(now) : null;
  const ready = now ? canPreview(hospital, selection, now) : false;
  return <section id="appointment" aria-labelledby="appointment-heading" className="appointment-panel scroll-mt-28 self-start rounded-2xl border border-border bg-card shadow-card xl:col-start-2 xl:row-start-1 xl:row-span-4">
    <div className="border-b border-border p-5">
      <h2 id="appointment-heading" tabIndex={-1} className="flex scroll-mt-28 items-center gap-2 text-xl font-bold text-navy outline-none focus-visible:ring-2 focus-visible:ring-ring"><CalendarDays className="size-5 text-primary" aria-hidden />Book an Appointment</h2>
      <p className="mt-2 text-sm text-muted-foreground">Select your preferred department, doctor, date and time.</p>
    </div>
    <div className="flex flex-col gap-5 p-5">
      <p className="flex gap-2 rounded-lg bg-teal-soft p-3 text-xs leading-relaxed text-teal"><Info className="size-4 shrink-0" aria-hidden />Demonstration availability only — no real schedules or reservations.</p>
      <div className="space-y-2"><Label htmlFor="appointment-department">Department</Label><Select value={selection.department} onValueChange={onDepartment}><SelectTrigger id="appointment-department" className="h-11 w-full"><SelectValue placeholder="Select a department" /></SelectTrigger><SelectContent>{hospital.departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label htmlFor="appointment-doctor">Doctor (Optional)</Label><Select value={selection.doctorId || "any"} onValueChange={(v) => onDoctor(v === "any" ? "" : v)}><SelectTrigger id="appointment-doctor" className="h-11 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any available doctor</SelectItem>{selection.department && doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.displayName}</SelectItem>)}</SelectContent></Select></div>
      <div><h3 className="mb-2 text-sm font-medium">Select Date</h3>{window && <Calendar mode="single" selected={selection.date ? parseLocalDate(selection.date) : undefined} onSelect={(date) => onDate(date ? localDateKey(date) : "")} disabled={[{ before: window.start }, { after: window.end }]} startMonth={window.start} endMonth={window.end} defaultMonth={window.start} className="w-full rounded-lg border border-border" classNames={{ root: "w-full", month: "w-full flex flex-col gap-3" }} />}<p className="mt-2 text-xs text-muted-foreground">Next 14 days · synthetic demo dates</p></div>
      <div><h3 className="mb-3 text-sm font-medium">Available Time Slots</h3><div aria-live="polite">{!selection.department ? <p className="text-sm text-muted-foreground">Select a department to explore demo times.</p> : !selection.date ? <p className="text-sm text-muted-foreground">Select a date to see demonstration slots.</p> : !slots.length ? <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">No demo slots for this date. Try another date or doctor.</p> : <div className="grid grid-cols-3 gap-2">{slots.map((time) => <Button key={time} variant={selection.time === time ? "default" : "outline"} className="h-11 px-1 text-xs" aria-pressed={selection.time === time} onClick={() => onTime(time)}>{timeLabel(time)}</Button>)}</div>}</div></div>
      <Button ref={continueRef} disabled={!ready} className="h-12 w-full" onClick={() => setOpen(true)}>Continue to Booking<ArrowRight aria-hidden /></Button>
      <p className="text-center text-xs text-muted-foreground">Department, date and time are required.</p>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg" onCloseAutoFocus={(event) => { event.preventDefault(); continueRef.current?.focus(); }}><DialogHeader><DialogTitle>Appointment selection preview</DialogTitle><DialogDescription>This is a frontend demonstration. No appointment has been reserved or confirmed.</DialogDescription></DialogHeader><dl className="grid gap-3 text-sm">{[["Fictional hospital", hospital.name], ["Department", selection.department], ["Doctor", selectedDoctor?.displayName ?? "Any available doctor"], ["Date", selection.date ? parseLocalDate(selection.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""], ["Time", timeLabel(selection.time)]].map(([label, value]) => <div key={label} className="grid gap-1 border-b border-border pb-2"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl><p className="text-sm text-muted-foreground">Real appointment booking will require patient authentication and secure booking services in a future phase.</p><DialogFooter className="gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Close</Button><Button asChild><Link to="/login">Go to Log In</Link></Button></DialogFooter></DialogContent></Dialog>
  </section>;
}