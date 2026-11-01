import { createFileRoute } from "@tanstack/react-router";
import { ForHospitalsPage } from "@/components/for-hospitals/for-hospitals-page";

export const Route = createFileRoute("/for-hospitals/")({
  head: () => ({
    meta: [
      { title: "For Hospitals | Ethiopian Healthcare Management System" },
      { name: "description", content: "Learn how public and private hospitals in Ethiopia can apply to join the healthcare appointment and management platform." },
      { property: "og:title", content: "For Hospitals | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Learn how public and private hospitals in Ethiopia can apply to join the healthcare appointment and management platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForHospitalsPage,
});
