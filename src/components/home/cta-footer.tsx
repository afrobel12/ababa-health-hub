import { HeartPulse, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { footerNav, routes } from "@/config/navigation";
import { Brand } from "./brand";
import { NavLink } from "./coming-soon";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-primary text-primary-foreground">
      <HeartPulse className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 id="cta-title" className="text-3xl font-extrabold">Ready to get started?</h2>
          <p className="mt-2 opacity-90">Find hospitals, explore appointments, and manage your healthcare journey.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary" className="h-12 px-7 text-base text-primary">
            <NavLink target={routes.hospitals}><Search className="h-5 w-5" aria-hidden /> Find Hospitals</NavLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <NavLink target={routes.register}><UserPlus className="h-5 w-5" aria-hidden /> Create Account</NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-8">
        <div>
          <Brand inverted />
          <p className="mt-4 text-sm opacity-75">Better healthcare. A healthier Ethiopia.</p>
        </div>
        {footerNav.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h3 className="text-sm font-bold">{g.title}</h3>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  <NavLink target={l} className="text-sm opacity-75 transition-opacity hover:opacity-100" />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-navy-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs opacity-70 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Ethiopian Healthcare Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
