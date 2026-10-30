import { createFileRoute } from "@tanstack/react-router";
import { PatientRegistrationPage } from "@/components/register/patient-registration-page";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Your Patient Account | Ethiopian Healthcare Management System" },
      {
        name: "description",
        content:
          "Register as a patient in four steps: personal details, identity information, account setup and phone verification. A frontend design prototype.",
      },
      { property: "og:title", content: "Create Your Patient Account" },
      {
        property: "og:description",
        content: "A four-step patient registration preview for the Ethiopian Healthcare Management System.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PatientRegistrationPage,
});
