import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, InformationNotice } from "./fields";
import { validateIdentity, type FieldErrors, type IdentityDetails } from "./validation";

export function IdentityDetailsStep({
  value,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  value: IdentityDetails;
  errors: FieldErrors<IdentityDetails>;
  onChange: (patch: Partial<IdentityDetails>) => void;
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
      <FormField
        label="National ID Number"
        error={errors.nationalId}
        description="Your identification information will require verification when secure registration services become available."
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            value={value.nationalId}
            onChange={(e) => onChange({ nationalId: e.target.value })}
            placeholder="Enter your national ID number"
            maxLength={32}
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="h-11"
          />
        )}
      </FormField>

      <InformationNotice title="Don't have a National ID?">
        <p>
          Patients without standard identification may be registered through an authorized hospital-assisted
          process. Ask a hospital receptionist for assistance.
        </p>
      </InformationNotice>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="h-11">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Personal Details
        </Button>
        <Button type="submit" className="h-11 px-6">
          Continue to Account Setup <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}

export { validateIdentity };
