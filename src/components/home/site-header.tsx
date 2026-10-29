import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNav, routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { NavLink } from "./coming-soon";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls = (active: boolean) =>
    cn(
      "relative py-2 text-sm font-medium transition-colors hover:text-primary",
      active ? "text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary" : "text-foreground",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-20 lg:grid-cols-[auto_1fr_auto]">
          <Link to="/" aria-label="Ethiopian Healthcare Management System home" className="min-w-0">
            <Brand />
          </Link>
          <nav aria-label="Main" className="hidden justify-center gap-8 lg:flex">
            {mainNav.map((n) => (
              <NavLink
                key={n.href}
                target={n}
                className={linkCls(n === routes.home)}
                aria-current={n === routes.home ? "page" : undefined}
              />
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="outline" asChild className="h-10 border-primary px-6 text-primary hover:bg-accent hover:text-primary">
              <NavLink target={routes.login} />
            </Button>
            <Button asChild className="h-10 px-6">
              <NavLink target={routes.register} />
            </Button>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1 px-4">
                {mainNav.map((n) => (
                  <NavLink
                    key={n.href}
                    target={n}
                    onSelect={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-3 text-base font-medium hover:bg-accent",
                      n === routes.home ? "bg-accent text-primary" : "text-foreground",
                    )}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid grid-cols-2 gap-3 pb-3 lg:hidden">
          <Button variant="outline" asChild className="border-primary text-primary hover:text-primary">
            <NavLink target={routes.login} />
          </Button>
          <Button asChild>
            <NavLink target={routes.register} />
          </Button>
        </div>
      </div>
    </header>
  );
}
