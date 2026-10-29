import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { SiteHeader } from "@/components/home/site-header";
import { Hero } from "@/components/home/hero";
import { HospitalSearch } from "@/components/home/hospital-search";
import { ForHospitals, HowItWorks, KeyFeatures } from "@/components/home/info-sections";
import { FinalCta, SiteFooter } from "@/components/home/cta-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find Hospitals in Ethiopia | Ethiopian Healthcare Management System" },
      { name: "description", content: "Search participating hospitals across Ethiopia, explore appointments and manage your bookings on one healthcare platform." },
      { property: "og:title", content: "Ethiopian Healthcare Management System" },
      { property: "og:description", content: "Find the healthcare you need, when you need it — participating hospitals across Ethiopia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ComingSoonProvider>
      <SiteHeader />
      <main>
        <Hero />
        <HospitalSearch />
        <HowItWorks />
        <KeyFeatures />
        <ForHospitals />
        <FinalCta />
      </main>
      <SiteFooter />
    </ComingSoonProvider>
  );
}
