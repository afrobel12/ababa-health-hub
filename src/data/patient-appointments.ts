// P-02 My Appointments: selectors, filters, eligibility, demo slots and
// local-only state transitions over the single dataset in patient-demo.ts.
// Pure functions only; nothing here fetches, persists or sends anything.
import {
  ACTIVE_STATUSES,
  addisDateParts,
  formatDate,
  formatTime,
  isUpcoming,
  type Appointment,
  type AppointmentStatus,
} from "./patient-demo";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const ADDIS_OFFSET_HOURS = 3;

// ---------------------------------------------------------------------------
// Selectors

const byDateAsc = (a: Appointment, b: Appointment) => a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime();

export const getUpcomingAppointments = (list: Appointment[], now: Date) => list.filter((a) => isUpcoming(a, now)).sort(byDateAsc);
export const getPastAppointments = (list: Appointment[], now: Date) =>
  list.filter((a) => !isUpcoming(a, now)).sort((a, b) => byDateAsc(b, a));

export function appointmentCounts(list: Appointment[], now: Date) {
  return {
    upcoming: getUpcomingAppointments(list, now).length,
    past: getPastAppointments(list, now).length,
    completed: list.filter((a) => a.status === "Completed").length,
    cancelled: list.filter((a) => a.status === "Cancelled").length,
  };
}

/** Hospitals referenced by the patient's own appointments, A–Z. */
export function patientHospitals(list: Appointment[]) {
  const map = new Map(list.map((a) => [a.hospitalId, a.hospital.name]));
  return [...map].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Eligibility (prototype policy: changes allowed up to 24 hours before)

export const MIN_NOTICE_HOURS = 24;
export const POLICY_TEXT =
  "Appointments may generally be cancelled or rescheduled at least 24 hours before the scheduled time. Hospital-specific exceptions are not implemented in this prototype.";

export type Eligibility = { allowed: true } | { allowed: false; reason: string };

export function managementEligibility(a: Appointment, now: Date): Eligibility {
  if (a.status === "Completed" || a.status === "Cancelled" || a.status === "No-show")
    return { allowed: false, reason: `This appointment is ${a.status === "No-show" ? "marked as a no-show" : a.status.toLowerCase()}, so it can no longer be changed.` };
  if (a.status === "Checked In") return { allowed: false, reason: "You have already checked in for this appointment, so it can no longer be changed." };
  const left = a.appointmentDateTime.getTime() - now.getTime();
  if (left <= 0) return { allowed: false, reason: "This appointment time has already passed." };
  if (left < MIN_NOTICE_HOURS * HOUR)
    return { allowed: false, reason: "Changes are only available at least 24 hours before the appointment in this demonstration." };
  return { allowed: true };
}
export const canCancelAppointment = (a: Appointment, now: Date) => managementEligibility(a, now).allowed;
export const canRescheduleAppointment = (a: Appointment, now: Date) => managementEligibility(a, now).allowed;

// ---------------------------------------------------------------------------
// Addis Ababa calendar helpers ("YYYY-MM-DD" keys)

const pad = (n: number) => String(n).padStart(2, "0");
export function addisDateKey(d: Date): string {
  const { y, m, d: day } = addisDateParts(d);
  return `${y}-${pad(m + 1)}-${pad(day)}`;
}
export function addisInstant(key: string, hh: number, mm: number): Date {
  const [y, m, d] = key.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d, hh - ADDIS_OFFSET_HOURS, mm));
}
const isDateKey = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

// ---------------------------------------------------------------------------
// Demo reschedule slots (synthetic; not real hospital availability)

export const RESCHEDULE_WINDOW_DAYS = 60;
export const RESCHEDULE_SLOTS = [
  { hh: 9, mm: 0 },
  { hh: 10, mm: 0 },
  { hh: 11, mm: 30 },
  { hh: 14, mm: 0 },
  { hh: 15, mm: 30 },
] as const;

export type SlotState = "available" | "current" | "clash" | "too-soon";
export type DemoSlot = { value: string; label: string; instant: Date; state: SlotState };

export function rescheduleSlots(list: Appointment[], appt: Appointment, dateKey: string, now: Date): DemoSlot[] {
  if (!isDateKey(dateKey)) return [];
  const others = list.filter((a) => a.id !== appt.id && isUpcoming(a, now)).map((a) => a.appointmentDateTime.getTime());
  return RESCHEDULE_SLOTS.map(({ hh, mm }) => {
    const instant = addisInstant(dateKey, hh, mm);
    const t = instant.getTime();
    const state: SlotState =
      t === appt.appointmentDateTime.getTime()
        ? "current"
        : t - now.getTime() < MIN_NOTICE_HOURS * HOUR
          ? "too-soon"
          : others.includes(t)
            ? "clash"
            : "available";
    return { value: `${pad(hh)}:${pad(mm)}`, label: formatTime(instant), instant, state };
  });
}

/** Addis dates (today → window end) that have at least one available slot. */
export function rescheduleDateKeys(list: Appointment[], appt: Appointment, now: Date): string[] {
  const keys: string[] = [];
  for (let i = 0; i <= RESCHEDULE_WINDOW_DAYS; i++) {
    const key = addisDateKey(new Date(now.getTime() + i * DAY));
    if (rescheduleSlots(list, appt, key, now).some((s) => s.state === "available")) keys.push(key);
  }
  return keys;
}

// ---------------------------------------------------------------------------
// Local-only transitions

export type TransitionResult = { ok: true; appointments: Appointment[]; appointment: Appointment } | { ok: false; error: string };

export function cancelAppointment(list: Appointment[], id: string, now: Date): TransitionResult {
  const appt = list.find((a) => a.id === id);
  if (!appt) return { ok: false, error: "Appointment not found." };
  const elig = managementEligibility(appt, now);
  if (!elig.allowed) return { ok: false, error: elig.reason };
  const note = "Cancelled by the patient in the demonstration. No hospital was notified.";
  const updated: Appointment = {
    ...appt,
    status: "Cancelled",
    cancellationReason: "Cancelled by the patient in the demonstration.",
    statusHistory: [...appt.statusHistory, { status: "Cancelled", at: now, note }],
  };
  return { ok: true, appointment: updated, appointments: list.map((a) => (a.id === id ? updated : a)) };
}

export function rescheduleAppointment(list: Appointment[], id: string, newTime: Date, now: Date): TransitionResult {
  const appt = list.find((a) => a.id === id);
  if (!appt) return { ok: false, error: "Appointment not found." };
  const elig = managementEligibility(appt, now);
  if (!elig.allowed) return { ok: false, error: elig.reason };
  const t = newTime.getTime();
  if (Number.isNaN(t)) return { ok: false, error: "Choose a new date and time." };
  if (t === appt.appointmentDateTime.getTime()) return { ok: false, error: "Choose a different date or time from your current appointment." };
  if (t - now.getTime() < MIN_NOTICE_HOURS * HOUR) return { ok: false, error: "The new time must be at least 24 hours from now." };
  if (t - now.getTime() > (RESCHEDULE_WINDOW_DAYS + 1) * DAY) return { ok: false, error: "Choose a date within the next 60 days." };
  const slot = rescheduleSlots(list, appt, addisDateKey(newTime), now).find((s) => s.instant.getTime() === t);
  if (!slot) return { ok: false, error: "Choose one of the listed demonstration times." };
  if (slot.state === "clash") return { ok: false, error: "You already have another appointment at that time." };
  const from = appt.appointmentDateTime;
  const updated: Appointment = {
    ...appt,
    status: "Rescheduled",
    appointmentDateTime: newTime,
    rescheduledFrom: from,
    rescheduledAt: now,
    statusHistory: [
      ...appt.statusHistory,
      { status: "Rescheduled", at: now, note: `Moved from ${formatDate(from)} at ${formatTime(from)} to ${formatDate(newTime)} at ${formatTime(newTime)} in the demonstration.` },
    ],
  };
  return { ok: true, appointment: updated, appointments: list.map((a) => (a.id === id ? updated : a)) };
}

// ---------------------------------------------------------------------------
// List filters (kept in the URL: non-sensitive, fictional values only)

export type AppointmentTab = "upcoming" | "past";
export type AppointmentFilters = { q: string; status: string; hospital: string; range: string; from: string; to: string; sort: string };
export type AppointmentsSearch = AppointmentFilters & { tab: AppointmentTab };

export const EMPTY_FILTERS: AppointmentFilters = { q: "", status: "all", hospital: "all", range: "all", from: "", to: "", sort: "" };
export const APPOINTMENTS_SEARCH_DEFAULTS: AppointmentsSearch = { tab: "upcoming", ...EMPTY_FILTERS };
export const PAGE_SIZE = 6;

const str = (v: unknown, d: string) => (typeof v === "string" ? v : d);
export function validateAppointmentsSearch(search: Record<string, unknown>): AppointmentsSearch {
  return {
    tab: search["tab"] === "past" ? "past" : "upcoming",
    q: str(search["q"], ""),
    status: str(search["status"], "all"),
    hospital: str(search["hospital"], "all"),
    range: str(search["range"], "all"),
    from: str(search["from"], ""),
    to: str(search["to"], ""),
    sort: str(search["sort"], ""),
  };
}

export const STATUS_OPTIONS: Record<AppointmentTab, AppointmentStatus[]> = {
  upcoming: ["Booked", "Rescheduled", "Checked In"],
  past: ["Completed", "Cancelled", "No-show"],
};
export const RANGE_OPTIONS: Record<AppointmentTab, { value: string; label: string }[]> = {
  upcoming: [
    { value: "all", label: "All dates" },
    { value: "7", label: "Next 7 days" },
    { value: "30", label: "Next 30 days" },
    { value: "custom", label: "Custom date range" },
  ],
  past: [
    { value: "all", label: "All dates" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "custom", label: "Custom date range" },
  ],
};
export const SORT_OPTIONS = [
  { value: "date-asc", label: "Appointment Date: Earliest" },
  { value: "date-desc", label: "Appointment Date: Latest" },
  { value: "hospital-asc", label: "Hospital Name: A–Z" },
];
export const defaultSort = (tab: AppointmentTab) => (tab === "upcoming" ? "date-asc" : "date-desc");
export const effectiveSort = (f: AppointmentFilters, tab: AppointmentTab) =>
  SORT_OPTIONS.some((o) => o.value === f.sort) ? f.sort : defaultSort(tab);

/** Keeps criteria that make sense on `tab`; resets the rest. */
export function compatibleFilters(f: AppointmentFilters, tab: AppointmentTab): AppointmentFilters {
  return {
    ...f,
    status: f.status === "all" || (STATUS_OPTIONS[tab] as string[]).includes(f.status) ? f.status : "all",
    range: RANGE_OPTIONS[tab].some((o) => o.value === f.range) ? f.range : "all",
  };
}

export function dateRangeError(f: AppointmentFilters): string | null {
  if (f.range !== "custom") return null;
  if ((f.from && !isDateKey(f.from)) || (f.to && !isDateKey(f.to))) return "Enter valid dates.";
  if (f.from && f.to && f.from > f.to) return "The start date must be on or before the end date.";
  return null;
}

export function activeFilterCount(f: AppointmentFilters): number {
  return [f.q.trim() !== "", f.status !== "all", f.hospital !== "all", f.range !== "all"].filter(Boolean).length;
}

export function filterAppointments(list: Appointment[], tab: AppointmentTab, raw: AppointmentFilters, now: Date): Appointment[] {
  const f = compatibleFilters(raw, tab);
  const base = tab === "upcoming" ? getUpcomingAppointments(list, now) : getPastAppointments(list, now);
  const q = f.q.trim().toLowerCase();
  const n = now.getTime();
  const days = Number(f.range);
  const rangeOk = (a: Appointment) => {
    const t = a.appointmentDateTime.getTime();
    if (f.range === "custom") {
      if (dateRangeError(f)) return true; // invalid range is shown as an error and not applied
      const key = addisDateKey(a.appointmentDateTime);
      return (!f.from || key >= f.from) && (!f.to || key <= f.to);
    }
    if (!Number.isFinite(days)) return true;
    return tab === "upcoming" ? t <= n + days * DAY : t >= n - days * DAY;
  };
  const result = base.filter(
    (a) =>
      (!q || a.hospital.name.toLowerCase().includes(q) || a.bookingReference.toLowerCase().includes(q)) &&
      (f.status === "all" || a.status === f.status) &&
      (f.hospital === "all" || a.hospitalId === f.hospital) &&
      rangeOk(a),
  );
  const sort = effectiveSort(f, tab);
  return result.sort((a, b) => {
    if (sort === "hospital-asc") return a.hospital.name.localeCompare(b.hospital.name) || byDateAsc(a, b);
    return sort === "date-asc" ? byDateAsc(a, b) : byDateAsc(b, a);
  });
}

/** True when any active status may still need management (used for copy). */
export const isActiveStatus = (s: AppointmentStatus) => ACTIVE_STATUSES.includes(s);
