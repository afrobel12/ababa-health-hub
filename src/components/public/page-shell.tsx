import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/cta-footer";
import { cn } from "@/lib/utils";

/** Shared public header + footer around a supporting page. */
export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <ComingSoonProvider>
      <SiteHeader />
      <main className="min-w-0">{children}</main>
      <SiteFooter />
    </ComingSoonProvider>
  );
}

export type Crumb = { label: string; to?: "/" | "/for-hospitals" };

export function PageBreadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {c.to ? (
              <Link to={c.to} className="rounded hover:text-primary hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Light-blue page hero used by About, Contact and legal pages. */
export function PublicPageHero({
  eyebrow,
  title,
  description,
  crumbs,
  badge,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-border bg-sky", className)}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <PageBreadcrumbs items={crumbs} />
        {badge && <div className="mt-6">{badge}</div>}
        {eyebrow && (
          <p className="mt-6 inline-flex rounded-full bg-teal-soft px-3 py-1 text-xs font-bold tracking-wider text-teal">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</div>}
        {children}
      </div>
    </section>
  );
}

export function DraftBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-warning-border bg-warning-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-warning">
      {children}
    </span>
  );
}

export function SectionHeading({ id, title, intro }: { id?: string; title: string; intro?: string }) {
  return (
    <div className="mb-6 max-w-2xl sm:mb-8">
      <h2 id={id} className="text-2xl font-bold text-navy sm:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-2 leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
