// Pure validation helpers for the registration wizard. Kept separate from the
// components so they can be unit-tested without rendering.

export type PersonalDetails = {
  firstName: string;
  middleName: string;
  surname: string;
  dob: string; // yyyy-mm-dd from a date input
  gender: string;
};

export type IdentityDetails = {
  nationalId: string;
};

export type AccountDetails = {
  phone: string; // local part, without the +251 country code
  email: string;
  password: string;
  confirmPassword: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"] as const;

export const DEMO_CODE = "123456";
export const DEMO_CODE_TTL_SECONDS = 60;

/** Whole years between a yyyy-mm-dd birth date and today. Returns null for invalid input. */
export function calcAge(dob: string, today: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!match) return null;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const birth = new Date(y, m - 1, d);
  if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function validatePersonal(p: PersonalDetails, today: Date = new Date()): FieldErrors<PersonalDetails> {
  const errors: FieldErrors<PersonalDetails> = {};
  if (!p.firstName.trim()) errors.firstName = "First name is required.";
  if (!p.middleName.trim()) errors.middleName = "Middle name is required.";
  if (!p.surname.trim()) errors.surname = "Surname is required.";
  if (!p.dob) {
    errors.dob = "Date of birth is required.";
  } else {
    const age = calcAge(p.dob, today);
    if (age === null) errors.dob = "Enter a valid date of birth.";
    else if (age < 0) errors.dob = "Date of birth cannot be in the future.";
  }
  if (!p.gender) errors.gender = "Please select an option.";
  return errors;
}

/** True when the date of birth is valid but the person is under 18. */
export function isUnderage(p: PersonalDetails, today: Date = new Date()): boolean {
  const age = calcAge(p.dob, today);
  return age !== null && age >= 0 && age < 18;
}

export function validateIdentity(i: IdentityDetails): FieldErrors<IdentityDetails> {
  const errors: FieldErrors<IdentityDetails> = {};
  const id = i.nationalId.trim();
  if (!id) errors.nationalId = "National ID number is required.";
  else if (id.length < 4) errors.nationalId = "Enter at least 4 characters.";
  return errors;
}

/**
 * Normalize an Ethiopian mobile number entered with or without the leading 0
 * or the +251 country code. Returns the 9-digit local form (starting with 9)
 * or null when the input is not a plausible Ethiopian mobile number.
 */
export function normalizeEthiopianPhone(raw: string): string | null {
  let digits = raw.replace(/[\s()-]/g, "").replace(/^\+/, "");
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith("251")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^9\d{8}$/.test(digits) ? digits : null;
}

/** Mask a normalized 9-digit phone number for display, e.g. +251 9•• ••• 123. */
export function maskPhone(local: string): string {
  const tail = local.slice(-3);
  return `+251 9\u2022\u2022 \u2022\u2022\u2022 ${tail}`;
}

export function validateAccount(a: AccountDetails): FieldErrors<AccountDetails> {
  const errors: FieldErrors<AccountDetails> = {};
  if (!a.phone.trim()) errors.phone = "Phone number is required.";
  else if (!normalizeEthiopianPhone(a.phone))
    errors.phone = "Enter a valid Ethiopian mobile number, e.g. 0911 234 567.";
  const email = a.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address, or leave this field empty.";
  if (a.password.length < 12) errors.password = "Password must be at least 12 characters.";
  if (!a.confirmPassword) errors.confirmPassword = "Please re-enter your password.";
  else if (a.confirmPassword !== a.password) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export type OtpResult = "empty" | "incomplete" | "incorrect" | "expired" | "ok";

export function checkDemoCode(code: string, expired: boolean): OtpResult {
  if (!code) return "empty";
  if (code.length < DEMO_CODE.length) return "incomplete";
  if (expired) return "expired";
  return code === DEMO_CODE ? "ok" : "incorrect";
}
