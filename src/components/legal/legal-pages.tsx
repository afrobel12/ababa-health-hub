import { LegalDraftLayout, type LegalSection } from "./legal-draft-layout";

const TBD = <p className="font-semibold text-warning">To be determined following legal review.</p>;

const privacySections: LegalSection[] = [
  {
    id: "purpose",
    title: "Purpose and Scope",
    body: <p>This draft outlines how the Ethiopian Healthcare Management System may handle information for patients, hospital staff and participating hospitals once it is live. It is a design-stage draft only.</p>,
  },
  {
    id: "information",
    title: "Information the Platform May Process",
    body: (
      <>
        <p>Depending on the final design, the platform may process:</p>
        <ul>
          <li>Account details such as name, phone number and optional email.</li>
          <li>Appointment requests and scheduling information.</li>
          <li>Medical information that a participating hospital authorizes a patient to view.</li>
          <li>Hospital and staff workspace information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "separation",
    title: "Patient and Hospital Record Separation",
    body: <p>The platform is being designed so that medical records remain specific to the hospital where care was provided, and are not shared with other hospitals automatically.</p>,
  },
  {
    id: "access",
    title: "Access Permissions",
    body: <p>Access to information is intended to depend on a person's role (for example patient, doctor, receptionist or hospital manager) and on the permissions granted by the relevant hospital.</p>,
  },
  {
    id: "security",
    title: "Proposed Security Safeguards",
    body: <p>Security safeguards are proposed but have not been implemented or independently assessed. The current prototype does not provide production-grade security and must not be used with real personal or medical information.</p>,
  },
  {
    id: "sharing",
    title: "Potential Data Sharing",
    body: <p>Any sharing with service providers or other parties has not been decided. Arrangements would be described here once confirmed.</p>,
  },
  { id: "retention", title: "Retention and Deletion — To Be Determined", body: TBD },
  { id: "rights", title: "Privacy Rights and Requests — Subject to Legal Review", body: <p>How people may access, correct or request deletion of their information will be defined after legal review.</p> },
  { id: "contact", title: "Contact Information — To Be Confirmed", body: <p>Official privacy contact details have not yet been published.</p> },
  {
    id: "status",
    title: "Policy Review Status",
    body: <p>This draft has not been approved and creates no legal commitments. It must be reviewed and finalised by qualified professionals before live deployment.</p>,
  },
];

const termsSections: LegalSection[] = [
  { id: "purpose", title: "Platform Purpose", body: <p>The platform is intended to help patients find participating hospitals and request appointments, and to help hospitals manage their services. The current prototype is not a live medical service.</p> },
  { id: "users", title: "Intended Users", body: <p>Intended users include patients, doctors, receptionists, hospital managers and participating hospitals in Ethiopia.</p> },
  { id: "patients", title: "Patient Accounts", body: <p>Patients would be responsible for providing accurate information and keeping their sign-in details secure. Account requirements are still being designed.</p> },
  { id: "participation", title: "Hospital Participation", body: <p>Public and private hospitals may apply to participate. Participation terms have not been finalised.</p> },
  { id: "verification", title: "Hospital Verification and Approval", body: <p>Hospitals would only be activated after verification and approval by the platform owner. Submitting an application does not grant access.</p> },
  { id: "appointments", title: "Appointments and Scheduling", body: <p>Appointment availability would be set by each hospital. Requests are not guaranteed until confirmed by the hospital.</p> },
  { id: "responsibilities", title: "User Responsibilities", body: <p>Users would be expected to use the platform lawfully and respectfully, and not to misuse other people's information.</p> },
  { id: "clinical", title: "Clinical Responsibility", body: <p>The platform does not provide medical advice. Clinical decisions remain the responsibility of qualified healthcare professionals. In an emergency, contact local emergency services.</p> },
  { id: "availability", title: "Platform Availability", body: <p>The prototype may change or be unavailable at any time. Service commitments for a live platform have not been defined.</p> },
  { id: "commercial", title: "Commercial Terms — To Be Determined", body: TBD },
  { id: "ip", title: "Intellectual Property — To Be Reviewed", body: TBD },
  { id: "changes", title: "Changes to Terms", body: <p>These terms are expected to change as the platform is designed. Any final version would be published before live use.</p> },
  { id: "status", title: "Legal and Contractual Review Status", body: <p>This draft is subject to professional legal review and creates no binding obligations.</p> },
];

export function PrivacyPolicyPage() {
  return (
    <LegalDraftLayout
      title="Privacy Policy"
      badge="DRAFT — NOT A FINAL LEGAL POLICY"
      notice="This page is a design-stage draft. Actual privacy practices, legal obligations, data-processing arrangements and patient rights must be confirmed before live deployment."
      sections={privacySections}
      related={{ to: "/terms", label: "draft Terms of Service" }}
    />
  );
}

export function TermsOfServicePage() {
  return (
    <LegalDraftLayout
      title="Terms of Service"
      badge="DRAFT — SUBJECT TO LEGAL REVIEW"
      notice="This page is a design-stage draft. The prototype is not a live medical service, and these terms require professional legal review before live deployment."
      sections={termsSections}
      related={{ to: "/privacy", label: "draft Privacy Policy" }}
    />
  );
}
