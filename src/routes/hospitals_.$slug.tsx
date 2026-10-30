import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/cta-footer";
import { HospitalDetailsPage, HospitalNotFound } from "@/components/hospitals/details-page";
import { findHospital } from "@/data/hospital-details";
import { validateDirectorySearch } from "@/data/directory-search";

export const Route = createFileRoute("/hospitals_/$slug")({
  validateSearch: validateDirectorySearch,
  head: ({ params }) => {
    const hospital = findHospital(params.slug);
    const title = hospital ? `${hospital.name} | Ethiopian Healthcare Management System` : "Hospital not found | Ethiopian Healthcare Management System";
    const description = hospital ? `Explore fictional departments, doctors and appointment selection previews at ${hospital.name} in ${hospital.city}.` : "This hospital could not be found in the demonstration directory.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: HospitalDetailsRoute,
});
function HospitalDetailsRoute() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const hospital = findHospital(slug);
  return <ComingSoonProvider><SiteHeader />{hospital ? <HospitalDetailsPage key={hospital.id} hospital={hospital} directory={search} /> : <HospitalNotFound />}<SiteFooter /></ComingSoonProvider>;
}