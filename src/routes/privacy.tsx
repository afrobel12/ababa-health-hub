import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyPage } from "@/components/legal/legal-pages";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy (Draft) | Ethiopian Healthcare Management System" },
      { name: "description", content: "A design-stage draft privacy policy for the Ethiopian Healthcare Management System, subject to legal review." },
      { property: "og:title", content: "Privacy Policy (Draft) | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "A design-stage draft privacy policy for the Ethiopian Healthcare Management System, subject to legal review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicyPage,
});
