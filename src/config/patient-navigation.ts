// Single source for Patient Portal navigation (desktop sidebar, mobile bottom
// bar, More menu, header label). Only Dashboard is built; Find Hospitals reuses
// the public directory; every other item opens the future-page notice.
import {
  Bell,
  CalendarDays,
  FileHeart,
  House,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { NavTarget } from "./navigation";

export const PATIENT_FUTURE_NOTICE = "This patient workspace page will be available in a future design phase.";

export type PatientNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Built destination. Absent = future page (shows the notice). */
  to?: "/patient" | "/hospitals";
  /** Planned path, kept here for later screens. */
  plannedPath: string;
  mobileLabel?: string;
  mobileIcon?: LucideIcon;
};

const item = (i: PatientNavItem) => i;

export const patientNav = {
  dashboard: item({ id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/patient", plannedPath: "/patient", mobileLabel: "Home", mobileIcon: House }),
  appointments: item({ id: "appointments", label: "Appointments", icon: CalendarDays, plannedPath: "/patient/appointments", mobileLabel: "Visits" }),
  findHospitals: item({ id: "find", label: "Find Hospitals", icon: Search, to: "/hospitals", plannedPath: "/hospitals", mobileLabel: "Find" }),
  medicalHistory: item({ id: "history", label: "Medical History", icon: FileHeart, plannedPath: "/patient/medical-history", mobileLabel: "Records" }),
  dependents: item({ id: "dependents", label: "Dependents", icon: Users, plannedPath: "/patient/dependents" }),
  notifications: item({ id: "notifications", label: "Notifications", icon: Bell, plannedPath: "/patient/notifications" }),
  profile: item({ id: "profile", label: "My Profile", icon: UserRound, plannedPath: "/patient/profile" }),
  settings: item({ id: "settings", label: "Settings", icon: Settings, plannedPath: "/patient/settings" }),
  help: item({ id: "help", label: "Help & Support", icon: LifeBuoy, plannedPath: "/patient/help" }),
};

export const patientPrimaryNav: PatientNavItem[] = [
  patientNav.dashboard,
  patientNav.appointments,
  patientNav.findHospitals,
  patientNav.medicalHistory,
  patientNav.dependents,
  patientNav.notifications,
  patientNav.profile,
];
export const patientUtilityNav: PatientNavItem[] = [patientNav.settings, patientNav.help];
export const patientBottomNav: PatientNavItem[] = [
  patientNav.dashboard,
  patientNav.appointments,
  patientNav.findHospitals,
  patientNav.medicalHistory,
];
export const patientMoreNav: PatientNavItem[] = [
  patientNav.dependents,
  patientNav.notifications,
  patientNav.profile,
  patientNav.settings,
  patientNav.help,
];

/** Future-page notice target for a nav item or a named action. */
export const futureTarget = (label: string, plannedPath = "/patient", notice = PATIENT_FUTURE_NOTICE): NavTarget => ({
  label,
  href: plannedPath,
  implemented: false,
  notice,
});

export const pageLabelFor = (pathname: string) =>
  patientPrimaryNav.find((n) => n.to && n.to === pathname.replace(/\/$/, ""))?.label ?? "Dashboard";
