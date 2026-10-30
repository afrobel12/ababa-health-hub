import { MOCK_HOSPITALS, type Hospital } from "./hospitals";
import avatar from "@/assets/demo-doctor.jpg";

export const findHospital = (slug: string) => MOCK_HOSPITALS.find((hospital) => hospital.slug === slug);
export const hospitalOverview = (hospital: Hospital) => ({
  overview: `${hospital.name} is a fictional ${hospital.type.toLowerCase()} healthcare facility in ${hospital.city}, ${hospital.region}. Its demonstration services include ${hospital.departments.join(", ")}.`,
  serviceFocus: hospital.departments.length > 2 ? "Multi-specialty services" : "Focused community services",
});
export type DemoDoctor = { id: string; hospitalId: string; displayName: string; department: string; specialty: string; avatar: string; shortBio: string; published: boolean };
const NAMES = ["Demo Dr. Hana", "Demo Dr. Selam", "Demo Dr. Eden", "Demo Dr. Rahel"];
export const MOCK_DOCTORS: DemoDoctor[] = MOCK_HOSPITALS.flatMap((hospital, index) =>
  hospital.departments.map((department, d) => ({
    id: `${hospital.id}-doctor-${d + 1}`, hospitalId: hospital.id,
    displayName: `${NAMES[d % NAMES.length] ?? NAMES[0]} ${index + 1}`,
    department, specialty: department, avatar,
    shortBio: `Fictional ${department.toLowerCase()} profile for this demonstration.`,
    published: index % 7 !== 1,
  })),
);
export const doctorsFor = (hospitalId: string, department = "") => MOCK_DOCTORS.filter((doctor) => doctor.published && doctor.hospitalId === hospitalId && (!department || doctor.department === department));

export type AppointmentSelection = { department: string; doctorId: string; date: string; time: string };
export const EMPTY_SELECTION: AppointmentSelection = { department: "", doctorId: "", date: "", time: "" };
export function changeDepartment(selection: AppointmentSelection, hospital: Hospital, department: string): AppointmentSelection {
  if (!hospital.departments.includes(department)) return { ...EMPTY_SELECTION };
  const doctor = doctorsFor(hospital.id, department).find((d) => d.id === selection.doctorId);
  return { department, doctorId: doctor?.id ?? "", date: "", time: "" };
}
export function changeDoctor(selection: AppointmentSelection, hospital: Hospital, doctorId: string): AppointmentSelection {
  if (!doctorId) return { ...selection, doctorId: "", time: "" };
  const doctor = doctorsFor(hospital.id).find((d) => d.id === doctorId);
  if (!doctor) return selection;
  return { department: doctor.department, doctorId, date: selection.department === doctor.department ? selection.date : "", time: "" };
}
export const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const parseLocalDate = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
};
export function demoDateWindow(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start); end.setDate(start.getDate() + 13);
  return { start, end };
}
export function isDemoDate(key: string, now: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const date = parseLocalDate(key);
  const { start, end } = demoDateWindow(now);
  return localDateKey(date) === key && date >= start && date <= end;
}
const SLOT_HOURS = [9, 10, 11, 13, 14, 15];
export const timeLabel = (time: string) => {
  const hour = Number(time.split(":")[0]);
  return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`;
};
export function demoSlots(hospital: Hospital, selection: AppointmentSelection, now: Date): string[] {
  if (!hospital.departments.includes(selection.department) || !isDemoDate(selection.date, now)) return [];
  if (selection.doctorId && !doctorsFor(hospital.id, selection.department).some((d) => d.id === selection.doctorId)) return [];
  const seed = [...`${hospital.id}|${selection.department}|${selection.doctorId}|${selection.date}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  if (seed % 5 === 0) return [];
  return SLOT_HOURS.filter((hour, index) => (seed + index) % 4 !== 0 && (selection.date !== localDateKey(now) || hour * 60 > now.getHours() * 60 + now.getMinutes())).map((hour) => `${hour}:00`);
}
export const canPreview = (hospital: Hospital, selection: AppointmentSelection, now: Date) => Boolean(selection.department && selection.date && selection.time && demoSlots(hospital, selection, now).includes(selection.time));