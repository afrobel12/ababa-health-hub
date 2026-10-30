// Pure validation helpers for the account recovery flow. Kept separate from
// the components so they can be unit-tested without rendering.

import { normalizeEthiopianPhone, type FieldErrors } from "@/components/register/validation";

export type RecoveryPhone = { phone: string };
export type NewPasswordDetails = { password: string; confirmPassword: string };

export const RECOVERY_STEP_LABELS = ["Phone", "Verification", "New Password", "Complete"] as const;

export function validateRecoveryPhone(v: RecoveryPhone): FieldErrors<RecoveryPhone> {
  const errors: FieldErrors<RecoveryPhone> = {};
  if (!v.phone.trim()) errors.phone = "Phone number is required.";
  else if (!normalizeEthiopianPhone(v.phone))
    errors.phone = "Enter a valid Ethiopian mobile number, e.g. 0911 234 567.";
  return errors;
}

export function validateNewPassword(v: NewPasswordDetails): FieldErrors<NewPasswordDetails> {
  const errors: FieldErrors<NewPasswordDetails> = {};
  if (!v.password) errors.password = "Enter a new password.";
  else if (v.password.length < 12) errors.password = "Password must be at least 12 characters.";
  if (!v.confirmPassword) errors.confirmPassword = "Please re-enter your new password.";
  else if (v.confirmPassword !== v.password) errors.confirmPassword = "Passwords do not match.";
  return errors;
}
