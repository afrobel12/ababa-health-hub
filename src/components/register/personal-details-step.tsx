import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, InformationNotice } from "./fields";
import {
  calcAge,
  isUnderage,
  validatePersonal,
  GENDER_OPTIONS,
  type FieldErrors,
  type PersonalDetails,
} from "./validation";

export function PersonalDetailsStep({
  value,
  errors,
  onChange,
  onContinue,
}: {
  value: PersonalDetails;
  errors: FieldErrors<PersonalDetails>;
  onChange: (patch: Partial<PersonalDetails>) => void;
  onContinue: () => void;
}) {
  const age = calcAge(value.dob);
  const underage = isUnderage(value);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="First Name" error={errors.firstName}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={value.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="Enter first name"
              autoComplete="given-name"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11"
            />
          )}
        </FormField>
        <FormField label="Middle Name" error={errors.middleName}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={value.middleName}
              onChange={(e) => onChange({ middleName: e.target.value })}
              placeholder="Enter middle name"
              autoComplete="additional-name"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className="h-11"
            />
          )}
        </FormField>
      </div>

      <FormField label="Surname" error={errors.surname}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            value={value.surname}
            onChange={(e) => onChange({ surname: e.target.value })}
            placeholder="Enter surname"
            autoComplete="family-name"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <FormField
        label="Date of Birth"
        error={errors.dob}
        description={age !== null && age >= 0 ? `Age: ${age} years` : undefined}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="date"
            value={value.dob}
            max={today}
            onChange={(e) => onChange({ dob: e.target.value })}
            autoComplete="bday"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <FormField label="Gender" error={errors.gender}>
        {({ id, invalid }) => (
          <Select value={value.gender} onValueChange={(v) => onChange({ gender: v })}>
            <SelectTrigger id={id} aria-invalid={invalid || undefined} className="h-11 w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      {underage && (
        <InformationNotice title="This wizard is for adult registration" tone="warning">
          <p>
            Based on the date of birth entered, this registration is for someone under 18. Child registration
            follows a separate guardian-assisted workflow that is not part of this prototype. Please ask a
            hospital receptionist about registering a child.
          </p>
        </InformationNotice>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" asChild className="h-11">
          <Link to="/">Back to Home</Link>
        </Button>
        <Button type="submit" className="h-11 px-6" disabled={underage}>
          Continue to Identity Details <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}

export { validatePersonal };
