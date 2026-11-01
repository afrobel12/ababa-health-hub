import { createFileRoute } from "@tanstack/react-router";
import { HospitalApplicationPage } from "@/components/for-hospitals/hospital-application-page";

export const Route = createFileRoute("/for-hospitals/apply")({
  head: () => ({
    meta: [
      { title: "Hospital Application | Ethiopian Healthcare Management System" },
      { name: "description", content: "A four-step demonstration hospital application. Nothing is submitted and no hospital account is created." },
      { property: "og:title", content: "Hospital Application | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "A four-step demonstration hospital application. Nothing is submitted and no hospital account is created." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HospitalApplicationPage,
});
