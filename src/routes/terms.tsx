import { createFileRoute } from "@tanstack/react-router";
import { TermsOfServicePage } from "@/components/legal/legal-pages";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service (Draft) | Ethiopian Healthcare Management System" },
      { name: "description", content: "Design-stage draft terms of service for the Ethiopian Healthcare Management System, subject to legal review." },
      { property: "og:title", content: "Terms of Service (Draft) | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Design-stage draft terms of service for the Ethiopian Healthcare Management System, subject to legal review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsOfServicePage,
});
