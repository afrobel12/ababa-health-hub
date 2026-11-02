// Synthetic frontend-only data for the demo Patient Portal (P-01).
// Everything here is fictional. Nothing is persisted, fetched or sent anywhere.
// Dates are built from a single `now` value so every derived figure stays
// consistent; display times use the Africa/Addis_Ababa timezone (UTC+3, no DST).
import { MOCK_HOSPITALS, type Hospital } from "./hospitals";
import { MOCK_DOCTORS, type DemoDoctor } from "./hospital-details";

export const ADDIS_TZ = "Africa/Addis_Ababa";
const ADDIS_OFFSET_HOURS = 3;

/** Calendar date (year, month, day) in Addis Ababa for an instant. */
export function addisDateParts(now: Date) {
  const shifted = new Date(now.getTime() + ADDIS_OFFSET_HOURS * 3_600_000);
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth(), d: shifted.getUTCDate() };
}

/** Instant for `dayOffset` days from today (Addis date) at hh:mm Addis time. */
export function addisDateTime(now: Date, dayOffset: number, hh: number, mm = 0): Date {
  const { y, m, d } = addisDateParts(now);
  return new Date(Date.UTC(y, m, d + dayOffset, hh - ADDIS_OFFSET_HOURS, mm));
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: ADDIS_TZ, weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(d);
export const formatShortDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: ADDIS_TZ, day: "numeric", month: "short", year: "numeric" }).format(d);
export const formatTime = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: ADDIS_TZ, hour: "numeric", minute: "2-digit" }).format(d);

export function formatRelative(then: Date, now: Date): string {
  const mins = Math.max(0, Math.round((now.getTime() - then.getTime()) / 60_000));
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const hospitalById = (id: string): Hospital => {
  const h = MOCK_HOSPITALS.find((x) => x.id === id);
  if (!h) throw new Error(`Unknown demo hospital ${id}`);
  return h;
};
const doctorById = (id: string): DemoDoctor | undefined => MOCK_DOCTORS.find((d) => d.id === id);

// ---------------------------------------------------------------------------
// Patient

export const MOCK_PATIENT = {
  id: "demo-patient-001",
  firstName: "Demo",
  middleName: "Sample",
  surname: "Patient",
  displayName: "Demo Patient",
  initials: "DP",
  dateOfBirth: "1992-03-14",
  phone: "+251 900 000 000",
  email: "demo.patient@example.com",
  height: { value: 168, unit: "cm", visitId: "v-h01-1" },
  weight: { value: 64, unit: "kg", visitId: "v-h01-1" },
} as const;

export type MockPatient = typeof MOCK_PATIENT;

export const fullName = (p: MockPatient = MOCK_PATIENT) => `${p.firstName} ${p.middleName} ${p.surname}`;

/** Age in whole years on the Addis calendar date of `now`. */
export function ageFromDob(dob: string, now: Date): number {
  const [by, bm, bd] = dob.split("-").map(Number) as [number, number, number];
  const { y, m, d } = addisDateParts(now);
  let age = y - by;
  if (m + 1 < bm || (m + 1 === bm && d < bd)) age -= 1;
  return age;
}

export const formatDob = (dob: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${dob}T00:00:00Z`));

// ---------------------------------------------------------------------------
// Appointments
// This is the ONE fictional appointment dataset. P-01 and P-02 both read it
// through PatientAppointmentsProvider; changes made there are memory-only.

export type AppointmentStatus = "Booked" | "Checked In" | "Completed" | "Cancelled" | "Rescheduled" | "No-show";
export const APPOINTMENT_STATUSES: readonly AppointmentStatus[] = ["Booked", "Checked In", "Completed", "Cancelled", "Rescheduled", "No-show"];
/** Statuses that still represent a live booking (when the time is in the future). */
export const ACTIVE_STATUSES: readonly AppointmentStatus[] = ["Booked", "Rescheduled", "Checked In"];

export type StatusEvent = { status: AppointmentStatus; at: Date; note: string };

/** Event timing: minutes relative to the appointment time, or minutes before `now`. */
type EventSeed = { status: AppointmentStatus; note: string } & ({ apptOffsetMin: number } | { minutesAgo: number });

type AppointmentSeed = {
  id: string;
  bookingReference: string;
  hospitalId: string;
  department: string;
  doctorId?: string;
  dayOffset: number;
  hh: number;
  mm: number;
  status: AppointmentStatus;
  reasonForVisit?: string;
  /** Original slot for seeds that were already rescheduled. */
  rescheduledFrom?: { dayOffset: number; hh: number; mm: number };
  cancellationReason?: string;
  events: EventSeed[];
};

const CREATED = "Demonstration appointment created in this prototype.";

const APPOINTMENT_SEEDS: AppointmentSeed[] = [
  {
    id: "a1", bookingReference: "DEMO-APT-1042", hospitalId: "h01", department: "Cardiology", doctorId: "h01-doctor-2",
    dayOffset: 3, hh: 9, mm: 30, status: "Booked", reasonForVisit: "Routine follow-up consultation",
    events: [{ status: "Booked", minutesAgo: 60 * 24 * 12, note: CREATED }],
  },
  {
    id: "a2", bookingReference: "DEMO-APT-1057", hospitalId: "h05", department: "General Medicine",
    dayOffset: 9, hh: 14, mm: 0, status: "Rescheduled", reasonForVisit: "Routine check-up and general consultation",
    rescheduledFrom: { dayOffset: 6, hh: 11, mm: 0 },
    events: [
      { status: "Booked", minutesAgo: 60 * 24 * 20, note: CREATED },
      { status: "Rescheduled", minutesAgo: 60 * 24 * 3, note: "Moved to a new demonstration date and time." },
    ],
  },
  {
    id: "a3", bookingReference: "DEMO-APT-1063", hospitalId: "h03", department: "Orthopedics", doctorId: "h03-doctor-3",
    dayOffset: 21, hh: 10, mm: 15, status: "Booked",
    events: [{ status: "Booked", minutesAgo: 95, note: CREATED }],
  },
  {
    id: "a4", bookingReference: "DEMO-APT-0988", hospitalId: "h01", department: "General Medicine",
    dayOffset: -45, hh: 11, mm: 0, status: "Completed", reasonForVisit: "General consultation",
    events: [
      { status: "Booked", apptOffsetMin: -60 * 24 * 10, note: CREATED },
      { status: "Checked In", apptOffsetMin: -20, note: "Marked as checked in on the demonstration record." },
      { status: "Completed", apptOffsetMin: 40, note: "Visit marked as completed on the demonstration record." },
    ],
  },
  {
    id: "a5", bookingReference: "DEMO-APT-0941", hospitalId: "h05", department: "Emergency Care",
    dayOffset: -120, hh: 16, mm: 45, status: "Completed",
    events: [
      { status: "Booked", apptOffsetMin: -120, note: CREATED },
      { status: "Checked In", apptOffsetMin: -10, note: "Marked as checked in on the demonstration record." },
      { status: "Completed", apptOffsetMin: 120, note: "Visit marked as completed on the demonstration record." },
    ],
  },
  {
    id: "a6", bookingReference: "DEMO-APT-1011", hospitalId: "h03", department: "Surgery",
    dayOffset: -30, hh: 8, mm: 30, status: "Cancelled", cancellationReason: "Cancelled by the patient in the demonstration.",
    events: [
      { status: "Booked", apptOffsetMin: -60 * 24 * 14, note: CREATED },
      { status: "Cancelled", apptOffsetMin: -60 * 24 * 3, note: "Cancelled by the patient in the demonstration." },
    ],
  },
  {
    id: "a7", bookingReference: "DEMO-APT-0967", hospitalId: "h02", department: "General Medicine",
    dayOffset: -75, hh: 13, mm: 0, status: "No-show",
    events: [
      { status: "Booked", apptOffsetMin: -60 * 24 * 7, note: CREATED },
      { status: "No-show", apptOffsetMin: 180, note: "Recorded as not attended on the demonstration record." },
    ],
  },
];

export type Appointment = {
  id: string;
  bookingReference: string;
  patientId: string;
  hospitalId: string;
  hospital: Hospital;
  department: string;
  doctorId?: string | undefined;
  doctor?: DemoDoctor | undefined;
  appointmentDateTime: Date;
  status: AppointmentStatus;
  createdAt: Date;
  reasonForVisit?: string | undefined;
  statusHistory: StatusEvent[];
  cancellationReason?: string | undefined;
  rescheduledFrom?: Date | undefined;
  rescheduledAt?: Date | undefined;
};

export function buildAppointments(now: Date): Appointment[] {
  return APPOINTMENT_SEEDS.map((s) => {
    const when = addisDateTime(now, s.dayOffset, s.hh, s.mm);
    const history = s.events.map((e) => ({
      status: e.status,
      note: e.note,
      at: "minutesAgo" in e ? new Date(now.getTime() - e.minutesAgo * 60_000) : new Date(when.getTime() + e.apptOffsetMin * 60_000),
    }));
    const resched = history.findLast((e) => e.status === "Rescheduled");
    return {
      id: s.id,
      bookingReference: s.bookingReference,
      patientId: MOCK_PATIENT.id,
      hospitalId: s.hospitalId,
      hospital: hospitalById(s.hospitalId),
      department: s.department,
      doctorId: s.doctorId,
      doctor: s.doctorId ? doctorById(s.doctorId) : undefined,
      appointmentDateTime: when,
      status: s.status,
      createdAt: history[0]!.at,
      reasonForVisit: s.reasonForVisit,
      statusHistory: history,
      cancellationReason: s.cancellationReason,
      rescheduledFrom: s.rescheduledFrom ? addisDateTime(now, s.rescheduledFrom.dayOffset, s.rescheduledFrom.hh, s.rescheduledFrom.mm) : undefined,
      rescheduledAt: resched?.at,
    };
  });
}

/** Active (Booked / Rescheduled / Checked In) and scheduled in the future. */
export const isUpcoming = (a: Appointment, now: Date) =>
  a.appointmentDateTime.getTime() > now.getTime() && ACTIVE_STATUSES.includes(a.status);

export function appointmentSummary(list: Appointment[], now: Date) {
  const upcoming = list
    .filter((a) => isUpcoming(a, now))
    .sort((a, b) => a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime());
  // Everything no longer active is history, including cancelled future slots.
  const past = list.filter((a) => !isUpcoming(a, now));
  return { upcoming, past, next: upcoming[0] ?? null };
}

// ---------------------------------------------------------------------------
// Notifications (bell and dashboard preview read the same list)

export type NotificationCategory = "booking" | "reminder" | "reschedule" | "platform";
export type PatientNotification = {
  id: string;
  title: string;
  shortMessage: string;
  category: NotificationCategory;
  createdAt: Date;
  read: boolean;
  appointmentId?: string | undefined;
};

type NotificationSeed = { id: string; category: NotificationCategory; minutesAgo: number; read: boolean; appointmentId?: string };
const NOTIFICATION_SEEDS: NotificationSeed[] = [
  { id: "n1", category: "booking", minutesAgo: 95, read: false, appointmentId: "a3" },
  { id: "n2", category: "reminder", minutesAgo: 60 * 20, read: false, appointmentId: "a1" },
  { id: "n3", category: "reschedule", minutesAgo: 60 * 24 * 3, read: true, appointmentId: "a2" },
  { id: "n4", category: "platform", minutesAgo: 60 * 24 * 10, read: true },
];

export const UNREAD_NOTIFICATION_COUNT = NOTIFICATION_SEEDS.filter((n) => !n.read).length;

export function buildNotifications(now: Date, appointments = buildAppointments(now)): PatientNotification[] {
  const byId = new Map(appointments.map((a) => [a.id, a]));
  return NOTIFICATION_SEEDS.map((s) => {
    const a = s.appointmentId ? byId.get(s.appointmentId) : undefined;
    const when = a ? `${formatDate(a.appointmentDateTime)} at ${formatTime(a.appointmentDateTime)}` : "";
    const copy: Record<NotificationCategory, { title: string; shortMessage: string }> = {
      booking: { title: "Appointment booked", shortMessage: `${a?.department} at ${a?.hospital.name} is booked for ${when}.` },
      reminder: { title: "Upcoming appointment reminder", shortMessage: `${a?.department} at ${a?.hospital.name} on ${when}.` },
      reschedule: { title: "Appointment rescheduled", shortMessage: `${a?.department} at ${a?.hospital.name} moved to ${when}.` },
      platform: { title: "Welcome to the Patient Portal demo", shortMessage: "Explore the dashboard. All information shown is fictional." },
    };
    return {
      id: s.id,
      category: s.category,
      read: s.read,
      appointmentId: s.appointmentId,
      createdAt: new Date(now.getTime() - s.minutesAgo * 60_000),
      ...copy[s.category],
    };
  }).sort((x, y) => y.createdAt.getTime() - x.createdAt.getTime());
}

// ---------------------------------------------------------------------------
// Medical history: Hospital -> Visits -> information the hospital made available

export type RecordAccess = "available" | "not-shared" | "restricted";
type VisitSeed = { id: string; hospitalId: string; dayOffset: number; access: RecordAccess; department?: string; summary?: string };

// Restricted and not-shared visits deliberately carry no department or summary.
const VISIT_SEEDS: VisitSeed[] = [
  { id: "v-h01-1", hospitalId: "h01", dayOffset: -45, access: "available", department: "General Medicine", summary: "General consultation" },
  { id: "v-h01-2", hospitalId: "h01", dayOffset: -200, access: "available", department: "Cardiology", summary: "Outpatient follow-up review" },
  { id: "v-h01-3", hospitalId: "h01", dayOffset: -320, access: "restricted" },
  { id: "v-h05-1", hospitalId: "h05", dayOffset: -120, access: "available", department: "Emergency Care", summary: "Emergency visit summary" },
  { id: "v-h05-2", hospitalId: "h05", dayOffset: -400, access: "not-shared" },
  { id: "v-h03-1", hospitalId: "h03", dayOffset: -260, access: "available", department: "Orthopedics", summary: "Outpatient assessment" },
];

export type Visit = Omit<VisitSeed, "dayOffset"> & { date: Date };
export type HospitalHistoryGroup = {
  hospital: Hospital;
  visits: Visit[];
  visibleCount: number;
  latestVisibleDate: Date | null;
};

export function buildMedicalHistory(now: Date): HospitalHistoryGroup[] {
  const visits: Visit[] = VISIT_SEEDS.map(({ dayOffset, ...v }) => ({ ...v, date: addisDateTime(now, dayOffset, 10) }));
  const ids = [...new Set(visits.map((v) => v.hospitalId))];
  return ids
    .map((id) => {
      const list = visits.filter((v) => v.hospitalId === id).sort((a, b) => b.date.getTime() - a.date.getTime());
      const visible = list.filter((v) => v.access === "available");
      return { hospital: hospitalById(id), visits: list, visibleCount: visible.length, latestVisibleDate: visible[0]?.date ?? null };
    })
    .sort((a, b) => (b.latestVisibleDate?.getTime() ?? 0) - (a.latestVisibleDate?.getTime() ?? 0));
}

/** Measurement date + source come from the linked visible visit. */
export function measurementSource(visitId: string, now: Date) {
  const group = buildMedicalHistory(now).find((g) => g.visits.some((v) => v.id === visitId));
  const visit = group?.visits.find((v) => v.id === visitId);
  if (!group || !visit || visit.access !== "available") return null;
  return { date: visit.date, source: group.hospital.name };
}

