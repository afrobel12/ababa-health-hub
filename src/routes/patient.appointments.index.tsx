import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { PatientAppointmentsPage } from "@/components/patient/appointments-page";
import { APPOINTMENTS_SEARCH_DEFAULTS, validateAppointmentsSearch } from "@/data/patient-appointments";

export const Route = createFileRoute("/patient/appointments/")({
  validateSearch: validateAppointmentsSearch,
  search: { middlewares: [stripSearchParams(APPOINTMENTS_SEARCH_DEFAULTS)] },
  head: () => ({
    meta: [
      { title: "My Appointments (Demo) | Ethiopian Healthcare Management System" },
      { name: "description", content: "Demo patient appointment list with upcoming and past visits, filters and demonstration-only changes." },
      { property: "og:title", content: "My Appointments — demo patient workspace" },
      { property: "og:description", content: "View and manage fictional hospital appointments in the patient portal demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PatientAppointmentsPage,
});
