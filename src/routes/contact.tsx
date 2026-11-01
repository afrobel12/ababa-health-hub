import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/contact/contact-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Support | Ethiopian Healthcare Management System" },
      { name: "description", content: "Send a demonstration inquiry about the Ethiopian Healthcare Management System. Messages are not sent in this preview." },
      { property: "og:title", content: "Contact & Support | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Send a demonstration inquiry about the Ethiopian Healthcare Management System. Messages are not sent in this preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});
