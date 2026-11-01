// Pure validation for the demonstration hospital application wizard.
// Nothing here is sent anywhere; values live only in React state.
import { normalizeEthiopianPhone, type FieldErrors } from "@/components/register/validation";
import { DEPARTMENTS } from "@/data/hospitals";

export const HOSPITAL_TYPES = ["Private Hospital", "Public Hospital"] as const;
export const APPLICATION_REGIONS = ["Addis Ababa", "Amhara", "Dire Dawa", "Oromia", "Sidama", "Tigray"] as const;
export const APPLICATION_DEPARTMENTS = DEPARTMENTS;
export const POSITION_OPTIONS = [
  "Hospital Director",
  "Hospital Manager",
  "Administrator",
  "Authorized Representative",
  "Other",
] as const;
export const MESSAGE_MAX = 1000;

export type HospitalInfo = {
  name: string;
  type: string;
  region: string;
  city: string;
  address: string;
  departments: string[];
};

export type RepresentativeInfo = {
  fullName: string;
  position: string;
  positionOther: string;
  phone: string; // local part, without +251
  email: string;
  licence: string;
  message: string;
};

export const emptyHospitalInfo: HospitalInfo = { name: "", type: "", region: "", city: "", address: "", departments: [] };
export const emptyRepresentative: RepresentativeInfo = {
  fullName: "",
  position: "",
  positionOther: "",
  phone: "",
  email: "",
  licence: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function validateHospitalInfo(h: HospitalInfo): FieldErrors<HospitalInfo> {
  const e: FieldErrors<HospitalInfo> = {};
  if (!h.name.trim()) e.name = "Hospital name is required.";
  else if (h.name.trim().length < 3) e.name = "Enter at least 3 characters.";
  if (!h.type) e.type = "Select a hospital type.";
  if (!h.region) e.region = "Select a region.";
  if (!h.city.trim()) e.city = "City is required.";
  if (!h.address.trim()) e.address = "Hospital address is required.";
  if (h.departments.length === 0) e.departments = "Select at least one department or service.";
  return e;
}

export function validateRepresentative(r: RepresentativeInfo): FieldErrors<RepresentativeInfo> {
  const e: FieldErrors<RepresentativeInfo> = {};
  if (!r.fullName.trim()) e.fullName = "Full name is required.";
  if (!r.position) e.position = "Select a position or job title.";
  else if (r.position === "Other" && !r.positionOther.trim()) e.positionOther = "Enter the position or job title.";
  if (!r.phone.trim()) e.phone = "Phone number is required.";
  else if (!normalizeEthiopianPhone(r.phone)) e.phone = "Enter a valid Ethiopian mobile number, e.g. 0911 234 567.";
  if (r.email.trim() && !isValidEmail(r.email)) e.email = "Enter a valid email address, or leave this field empty.";
  if (r.message.length > MESSAGE_MAX) e.message = `Keep the message under ${MESSAGE_MAX} characters.`;
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;

/** Trim surrounding whitespace before review. */
export function tidyHospitalInfo(h: HospitalInfo): HospitalInfo {
  return { ...h, name: h.name.trim(), city: h.city.trim(), address: h.address.trim() };
}

export function positionLabel(r: RepresentativeInfo): string {
  return r.position === "Other" ? r.positionOther.trim() : r.position;
}

/**
 * Highest step the user may move to from `current` without skipping validation.
 * Steps: 0 hospital, 1 representative, 2 review. Returns the first invalid step
 * when the target lies beyond it.
 */
export function allowedStep(target: number, h: HospitalInfo, r: RepresentativeInfo): number {
  if (target >= 1 && hasErrors(validateHospitalInfo(h))) return 0;
  if (target >= 2 && hasErrors(validateRepresentative(r))) return 1;
  return Math.min(target, 2);
}
