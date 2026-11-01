import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Home, Pencil, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, InformationNotice, InlineError } from "@/components/register/fields";
import { maskPhone, normalizeEthiopianPhone, type FieldErrors } from "@/components/register/validation";
import { cn } from "@/lib/utils";
import {
  APPLICATION_DEPARTMENTS,
  APPLICATION_REGIONS,
  HOSPITAL_TYPES,
  MESSAGE_MAX,
  POSITION_OPTIONS,
  positionLabel,
  type HospitalInfo,
  type RepresentativeInfo,
} from "./application-validation";

function SelectField({
  id,
  describedBy,
  invalid,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
  describedBy?: string | undefined;
  invalid: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className="h-11 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StepActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

export function HospitalInformationStep({
  value,
  errors,
  onChange,
  onContinue,
}: {
  value: HospitalInfo;
  errors: FieldErrors<HospitalInfo>;
  onChange: (patch: Partial<HospitalInfo>) => void;
  onContinue: () => void;
}) {
  const toggleDept = (d: string) =>
    onChange({
      departments: value.departments.includes(d) ? value.departments.filter((x) => x !== d) : [...value.departments, d],
    });
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-5"
    >
      <FormField label="Hospital Name" error={errors.name}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter hospital name"
            autoComplete="organization"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Hospital Type" error={errors.type}>
          {(ids) => (
            <SelectField
              {...ids}
              value={value.type}
              onChange={(v) => onChange({ type: v })}
              placeholder="Select hospital type"
              options={HOSPITAL_TYPES}
            />
          )}
        </FormField>
        <FormField label="Region" error={errors.region}>
          {(ids) => (
            <SelectField
              {...ids}
              value={value.region}
              onChange={(v) => onChange({ region: v })}
              placeholder="Select region"
              options={APPLICATION_REGIONS}
            />
          )}
        </FormField>
      </div>

      <FormField label="City" error={errors.city}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            value={value.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Adama"
            autoComplete="address-level2"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <FormField label="Hospital Address" error={errors.address} description="Institutional location only — not checked against any map service.">
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            value={value.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Enter facility address (e.g. area, sub-city, woreda)"
            rows={3}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
          />
        )}
      </FormField>

      <fieldset aria-describedby={errors.departments ? "dept-err" : "dept-desc"} className="space-y-2">
        <legend className="text-sm font-semibold text-navy">
          Departments / Services
          <span className="ml-1 text-destructive" aria-hidden>
            *
          </span>
          <span className="sr-only"> (required)</span>
        </legend>
        <p id="dept-desc" className="text-xs text-muted-foreground">
          Select all that apply. These are application details only and do not create hospital departments.
        </p>
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 md:grid-cols-4">
          {APPLICATION_DEPARTMENTS.map((d) => {
            const checked = value.departments.includes(d);
            return (
              <label
                key={d}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
                  checked ? "border-primary bg-accent font-semibold text-primary" : "border-input hover:bg-muted",
                )}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleDept(d)} className="sr-only" />
                <span
                  aria-hidden
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded border",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                {d}
              </label>
            );
          })}
        </div>
        <InlineError id="dept-err" message={errors.departments} />
      </fieldset>

      <StepActions>
        <Button asChild variant="outline" className="h-11">
          <Link to="/for-hospitals">Cancel</Link>
        </Button>
        <Button type="submit" className="h-11 px-6">
          Continue to Representative <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </StepActions>
    </form>
  );
}

export function RepresentativeInformationStep({
  value,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  value: RepresentativeInfo;
  errors: FieldErrors<RepresentativeInfo>;
  onChange: (patch: Partial<RepresentativeInfo>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-5"
    >
      <InformationNotice title="Use fictional details only">
        This is a demonstration form. Please enter made-up information and do not share real personal or identity documents.
      </InformationNotice>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Full Name" error={errors.fullName}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={value.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="Enter full name"
              autoComplete="name"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11"
            />
          )}
        </FormField>
        <FormField label="Position / Job Title" error={errors.position} description="Authority to apply is not verified in this preview.">
          {(ids) => (
            <SelectField
              {...ids}
              value={value.position}
              onChange={(v) => onChange({ position: v, positionOther: v === "Other" ? value.positionOther : "" })}
              placeholder="Select position"
              options={POSITION_OPTIONS}
            />
          )}
        </FormField>
      </div>

      {value.position === "Other" && (
        <FormField label="Your Position" error={errors.positionOther}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={value.positionOther}
              onChange={(e) => onChange({ positionOther: e.target.value })}
              placeholder="e.g. Medical Director"
              autoComplete="organization-title"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11"
            />
          )}
        </FormField>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Phone Number" error={errors.phone}>
          {({ id, describedBy, invalid }) => (
            <div className="flex gap-2">
              <span
                aria-hidden
                className="grid h-11 shrink-0 place-items-center rounded-md border border-input bg-muted px-3 text-sm font-semibold text-foreground"
              >
                +251
              </span>
              <Input
                id={id}
                type="tel"
                inputMode="tel"
                value={value.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="0911 234 567"
                autoComplete="tel-national"
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                className="h-11"
              />
            </div>
          )}
        </FormField>
        <FormField label="Email Address" required={false} optional error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="email"
              inputMode="email"
              value={value.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="name@example.com"
              autoComplete="email"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11"
            />
          )}
        </FormField>
      </div>

      <FormField
        label="Hospital Registration or Licence Reference"
        required={false}
        optional
        description="Formal institution verification will be part of a future secure onboarding process."
      >
        {({ id, describedBy }) => (
          <Input
            id={id}
            value={value.licence}
            onChange={(e) => onChange({ licence: e.target.value })}
            placeholder="Any reference (no specific format)"
            aria-describedby={describedBy}
            className="h-11"
          />
        )}
      </FormField>

      <FormField label="Additional Message" required={false} optional error={errors.message}>
        {({ id, describedBy, invalid }) => (
          <>
            <Textarea
              id={id}
              value={value.message}
              onChange={(e) => onChange({ message: e.target.value })}
              placeholder="Anything else you would like to share"
              rows={4}
              maxLength={MESSAGE_MAX}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
            />
            <p className="text-right text-xs text-muted-foreground">
              {value.message.length}/{MESSAGE_MAX}
            </p>
          </>
        )}
      </FormField>

      <StepActions>
        <Button type="button" variant="outline" className="h-11" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Button>
        <Button type="submit" className="h-11 px-6">
          Continue to Review <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </StepActions>
    </form>
  );
}

function ReviewCard({ title, onEdit, rows }: { title: string; onEdit: () => void; rows: [string, ReactNode][] }) {
  return (
    <section aria-label={title} className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="text-primary hover:text-primary">
          <Pencil className="h-4 w-4" aria-hidden /> Edit<span className="sr-only"> {title}</span>
        </Button>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm font-medium text-muted-foreground">{k}</dt>
            <dd className="min-w-0 break-words text-sm text-foreground sm:-mt-0">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ApplicationReviewStep({
  hospital,
  rep,
  onEdit,
  onBack,
  onSubmit,
}: {
  hospital: HospitalInfo;
  rep: RepresentativeInfo;
  onEdit: (step: 0 | 1) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const phone = normalizeEthiopianPhone(rep.phone);
  const notProvided = <span className="text-muted-foreground">Not provided</span>;
  return (
    <div className="space-y-5">
      <ReviewCard
        title="Hospital Information"
        onEdit={() => onEdit(0)}
        rows={[
          ["Hospital name", hospital.name],
          ["Type", hospital.type],
          ["Region", hospital.region],
          ["City", hospital.city],
          ["Address", <span className="whitespace-pre-line">{hospital.address}</span>],
          [
            "Departments",
            <ul className="flex flex-wrap gap-1.5">
              {hospital.departments.map((d) => (
                <li key={d} className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {d}
                </li>
              ))}
            </ul>,
          ],
        ]}
      />
      <ReviewCard
        title="Representative Information"
        onEdit={() => onEdit(1)}
        rows={[
          ["Full name", rep.fullName.trim()],
          ["Job title", positionLabel(rep)],
          ["Phone", phone ? maskPhone(phone) : rep.phone],
          ["Email", rep.email.trim() || notProvided],
          ["Licence reference", rep.licence.trim() || notProvided],
          ...(rep.message.trim() ? ([["Message", <span className="whitespace-pre-line">{rep.message.trim()}</span>]] as [string, ReactNode][]) : []),
        ]}
      />
      <InformationNotice title="Demonstration only">
        This is a frontend demonstration. No real hospital application will be submitted.
      </InformationNotice>
      <StepActions>
        <Button type="button" variant="outline" className="h-11" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Button>
        <Button type="button" className="h-11 px-6" onClick={onSubmit}>
          <Send className="h-4 w-4" aria-hidden /> Submit Demo Application
        </Button>
      </StepActions>
    </div>
  );
}

export function ApplicationCompleteStep({ onStartNew }: { onStartNew: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <p className="pt-1 leading-relaxed text-muted-foreground">
          In a future production system, an application like this would go through institution verification and a
          decision by the platform owner before any hospital workspace is set up.
        </p>
      </div>
      <InformationNotice title="This is a frontend demonstration only.">
        No real application has been sent, and no hospital account has been created.
      </InformationNotice>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 px-6">
          <Link to="/">
            <Home className="h-4 w-4" aria-hidden /> Return to Home
          </Link>
        </Button>
        <Button type="button" variant="outline" className="h-11 border-primary px-6 text-primary hover:text-primary" onClick={onStartNew}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Start New Application
        </Button>
      </div>
    </div>
  );
}
