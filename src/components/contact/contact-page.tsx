import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, InformationNotice } from "@/components/register/fields";
import type { FieldErrors } from "@/components/register/validation";
import { PublicPageHero, PublicPageShell } from "@/components/public/page-shell";
import {
  CONTACT_MESSAGE_MAX,
  INQUIRY_CATEGORIES,
  emptyInquiry,
  validateInquiry,
  type ContactInquiry,
} from "./contact-validation";

const helpfulLinks = [
  { to: "/hospitals", label: "Find a hospital", text: "Browse the demonstration directory." },
  { to: "/for-hospitals", label: "For hospitals", text: "Learn how hospitals could join." },
  { to: "/about", label: "About the platform", text: "Our mission and principles." },
  { to: "/privacy", label: "Privacy Policy (draft)", text: "How information may be handled." },
] as const;

export function ContactInquiryForm() {
  const [value, setValue] = useState<ContactInquiry>(emptyInquiry);
  const [errors, setErrors] = useState<FieldErrors<ContactInquiry>>({});
  const [sent, setSent] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const set = (p: Partial<ContactInquiry>) => setValue((v) => ({ ...v, ...p }));

  if (sent) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="space-y-5 outline-none">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 shrink-0 text-teal" aria-hidden />
          <h2 className="text-2xl font-extrabold text-navy">Demo inquiry complete</h2>
        </div>
        <InformationNotice title="Not sent">
          This is a frontend demonstration. Your message has not been sent.
        </InformationNotice>
        <Button
          type="button"
          variant="outline"
          className="h-11 border-primary text-primary hover:text-primary"
          onClick={() => {
            setSent(false);
            setErrors({});
          }}
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Write another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-labelledby="inquiry-title"
      onSubmit={(e) => {
        e.preventDefault();
        const errs = validateInquiry(value);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        // Nothing is transmitted or stored: discard the values immediately.
        setValue(emptyInquiry);
        setSent(true);
        requestAnimationFrame(() => statusRef.current?.focus());
      }}
      className="space-y-5"
    >
      <h2 id="inquiry-title" className="text-2xl font-extrabold text-navy">General inquiry</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Full Name" error={errors.fullName}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} value={value.fullName} onChange={(e) => set({ fullName: e.target.value })} autoComplete="name" placeholder="Enter your name" aria-describedby={describedBy} aria-invalid={invalid || undefined} className="h-11" />
          )}
        </FormField>
        <FormField label="Email Address" error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="email" inputMode="email" value={value.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" placeholder="name@example.com" aria-describedby={describedBy} aria-invalid={invalid || undefined} className="h-11" />
          )}
        </FormField>
        <FormField label="Phone Number" required={false} optional error={errors.phone}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="tel" inputMode="tel" value={value.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="0911 234 567" aria-describedby={describedBy} aria-invalid={invalid || undefined} className="h-11" />
          )}
        </FormField>
        <FormField label="Inquiry Category" error={errors.category}>
          {({ id, describedBy, invalid }) => (
            <Select value={value.category} onValueChange={(v) => set({ category: v })}>
              <SelectTrigger id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className="h-11 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>
      <FormField label="Message" error={errors.message}>
        {({ id, describedBy, invalid }) => (
          <>
            <Textarea id={id} value={value.message} onChange={(e) => set({ message: e.target.value })} rows={6} maxLength={CONTACT_MESSAGE_MAX} placeholder="How can we help?" aria-describedby={describedBy} aria-invalid={invalid || undefined} />
            <p className="text-right text-xs text-muted-foreground">{value.message.length}/{CONTACT_MESSAGE_MAX}</p>
          </>
        )}
      </FormField>
      <p className="text-xs text-muted-foreground">Please use fictional details. Nothing you type here is sent or saved.</p>
      <Button type="submit" className="h-11 w-full px-6 sm:w-auto">
        <Send className="h-4 w-4" aria-hidden /> Submit Demo Inquiry
      </Button>
    </form>
  );
}

export function ContactPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        eyebrow="SUPPORT"
        title="Contact & Support"
        description="Have a question about the platform or hospital participation? Use the form below. This is a design preview, so official contact channels have not yet been published."
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
          <ContactInquiryForm />
        </div>
        <aside aria-labelledby="helpful-title" className="min-w-0">
          <h2 id="helpful-title" className="text-lg font-bold text-navy">Helpful pages</h2>
          <ul className="mt-4 space-y-3">
            {helpfulLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:border-primary/40">
                  <span className="min-w-0">
                    <span className="block font-semibold text-navy group-hover:text-primary">{l.label}</span>
                    <span className="block text-sm text-muted-foreground">{l.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PublicPageShell>
  );
}
