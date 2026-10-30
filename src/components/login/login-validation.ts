import { normalizeEthiopianPhone } from "@/components/register/validation";

export type LoginValues = { phone: string; password: string };
export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export const LIVE_SIGNIN_UNAVAILABLE =
  "Live sign-in is not available in this prototype. Explore a demo workspace instead.";

export function validateLogin(v: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!v.phone.trim()) errors.phone = "Enter your phone number.";
  else if (!normalizeEthiopianPhone(v.phone)) errors.phone = "Enter a valid phone number.";
  if (!v.password) errors.password = "Enter your password.";
  return errors;
}
