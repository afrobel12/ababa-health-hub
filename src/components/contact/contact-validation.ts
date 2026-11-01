import { normalizeEthiopianPhone, type FieldErrors } from "@/components/register/validation";
import { isValidEmail } from "@/components/for-hospitals/application-validation";

export const INQUIRY_CATEGORIES = [
  "General Inquiry",
  "Patient Platform Question",
  "Hospital Partnership",
  "Technical Question",
  "Other",
] as const;

export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 1000;

export type ContactInquiry = { fullName: string; email: string; phone: string; category: string; message: string };

export const emptyInquiry: ContactInquiry = { fullName: "", email: "", phone: "", category: "", message: "" };

export function validateInquiry(c: ContactInquiry): FieldErrors<ContactInquiry> {
  const e: FieldErrors<ContactInquiry> = {};
  if (!c.fullName.trim()) e.fullName = "Full name is required.";
  if (!c.email.trim()) e.email = "Email address is required.";
  else if (!isValidEmail(c.email)) e.email = "Enter a valid email address.";
  if (c.phone.trim() && !normalizeEthiopianPhone(c.phone))
    e.phone = "Enter a valid Ethiopian mobile number, or leave this field empty.";
  if (!c.category) e.category = "Select an inquiry category.";
  const msg = c.message.trim();
  if (!msg) e.message = "Message is required.";
  else if (msg.length < CONTACT_MESSAGE_MIN) e.message = `Enter at least ${CONTACT_MESSAGE_MIN} characters.`;
  else if (msg.length > CONTACT_MESSAGE_MAX) e.message = `Keep the message under ${CONTACT_MESSAGE_MAX} characters.`;
  return e;
}
