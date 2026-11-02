import { createFileRoute } from "@tanstack/react-router";
import { PatientDashboardPage } from "@/components/patient/dashboard-page";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard (Demo) | Ethiopian Healthcare Management System" },
      {
        name: "description",
        content: "Demo patient workspace with fictional appointments, notifications and hospital-grouped medical history previews.",
      },
      { property: "og:title", content: "Patient Dashboard — demo workspace" },
      { property: "og:description", content: "A frontend demonstration of the patient portal using fictional information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PatientDashboardPage,
});
