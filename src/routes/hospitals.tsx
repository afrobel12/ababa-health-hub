import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/cta-footer";
import { HospitalDirectoryPage } from "@/components/hospitals/directory-page";
import { validateDirectorySearch, DIRECTORY_DEFAULTS } from "@/data/directory-search";

export const Route = createFileRoute("/hospitals")({
  validateSearch: validateDirectorySearch,
  search: {
    // Keep default values out of the shareable URL.
    middlewares: [stripSearchParams(DIRECTORY_DEFAULTS)],
  },
  head: () => ({
    meta: [
      { title: "Find a Hospital | Ethiopian Healthcare Management System" },
      {
        name: "description",
        content: "Explore participating hospitals and healthcare services across Ethiopia — search and filter the demonstration hospital directory.",
      },
      { property: "og:title", content: "Find a Hospital | Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Explore participating hospitals and healthcare services across Ethiopia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HospitalsRoute,
});

function HospitalsRoute() {
  return (
    <ComingSoonProvider>
      <SiteHeader />
      <HospitalDirectoryPage />
      <SiteFooter />
    </ComingSoonProvider>
  );
}
