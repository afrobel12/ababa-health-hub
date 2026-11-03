import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { PatientAppointmentDetailsPage } from "@/components/patient/appointment-details-page";
import { APPOINTMENTS_SEARCH_DEFAULTS, validateAppointmentsSearch } from "@/data/patient-appointments";

// The list's (non-sensitive) tab/filter params ride along so Back restores the view.
export const Route = createFileRoute("/patient/appointments/$id")({
  validateSearch: validateAppointmentsSearch,
  search: { middlewares: [stripSearchParams(APPOINTMENTS_SEARCH_DEFAULTS)] },
  head: () => ({
    meta: [
      { title: "Appointment Details (Demo) | Ethiopian Healthcare Management System" },
      { name: "description", content: "Details, status history and demonstration-only actions for a fictional patient appointment." },
      { property: "og:title", content: "Appointment Details — demo patient workspace" },
      { property: "og:description", content: "Review a fictional appointment and its status history in the patient portal demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PatientAppointmentDetailsPage,
});
