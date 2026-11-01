import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { DraftBadge, PublicPageHero, PublicPageShell } from "@/components/public/page-shell";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Readable draft-document layout with table of contents. Not a legal policy. */
export function LegalDraftLayout({
  title,
  badge,
  notice,
  sections,
  related,
}: {
  title: string;
  badge: string;
  notice: string;
  sections: LegalSection[];
  related: { to: "/privacy" | "/terms"; label: string };
}) {
  return (
    <PublicPageShell>
      <PublicPageHero crumbs={[{ label: "Home", to: "/" }, { label: title }]} badge={<DraftBadge>{badge}</DraftBadge>} title={title}>
        <div role="note" className="mt-6 flex max-w-3xl gap-3 rounded-xl border border-warning-border bg-warning-soft p-4 text-sm leading-relaxed text-warning">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>{notice}</p>
        </div>
      </PublicPageHero>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[15rem_1fr] lg:px-8">
        <nav aria-labelledby="toc-title" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <h2 id="toc-title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contents</h2>
          <ol className="mt-3 space-y-1 border-l border-border text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-foreground hover:border-primary hover:text-primary">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="min-w-0 max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2 id={`${s.id}-h`} className="text-xl font-bold text-navy sm:text-2xl">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 break-words leading-relaxed text-muted-foreground [&_li]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5">
                {s.body}
              </div>
            </section>
          ))}
          <p className="border-t border-border pt-6 text-sm text-muted-foreground">
            See also the{" "}
            <Link to={related.to} className="font-semibold text-primary underline underline-offset-2">
              {related.label}
            </Link>
            .
          </p>
        </article>
      </div>
    </PublicPageShell>
  );
}
