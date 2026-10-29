import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/navigation";
import heroImg from "@/assets/hero-clinic.jpg";
import { NavLink } from "./coming-soon";

export function Hero() {
  return (
    <section className="bg-sky">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-0">
        <div className="lg:py-20">
          <p className="text-xs font-bold tracking-[0.25em] text-teal">BETTER HEALTHCARE · STRONGER ETHIOPIA</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            Find the healthcare you need, <span className="text-teal">when you need it.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Search participating hospitals across Ethiopia, explore available appointments, and manage your bookings
            through one healthcare platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <NavLink target={routes.hospitals}>
                <Search className="h-5 w-5" aria-hidden /> Find Hospitals
              </NavLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-primary bg-background px-7 text-base text-primary hover:bg-accent hover:text-primary">
              <NavLink target={routes.register}>
                <UserPlus className="h-5 w-5" aria-hidden /> Create Account
              </NavLink>
            </Button>
          </div>
        </div>
        <div className="relative lg:h-full">
          <img
            src={heroImg}
            alt="A smiling doctor with a tablet speaks with a mother and her young child in a bright clinic"
            width={1408}
            height={960}
            className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-full lg:min-h-[460px] lg:rounded-none"
          />
        </div>
      </div>
    </section>
  );
}
