import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/cta-footer";
import { HospitalDirectoryPage } from "@/components/hospitals/directory-page";

export const Route = createFileRoute("/hospitals")({
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : "",
    department: typeof search.department === "string" ? search.department : "",
    type: search.type === "public" || search.type === "private" ? search.type : ("all" as const),
    q: typeof search.q === "string" ? search.q : "",
  }),
  search: {
    // Keep default values out of the shareable URL.
    middlewares: [stripSearchParams({ city: "", department: "", type: "all" as const, q: "" })],
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
