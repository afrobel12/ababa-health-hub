import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about/about-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Platform | Ethiopian Healthcare Management System" },
      { name: "description", content: "Learn about the mission of the Ethiopian Healthcare Management System and who it is being designed to serve." },
      { property: "og:title", content: "About the Platform | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Learn about the mission of the Ethiopian Healthcare Management System and who it is being designed to serve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});
