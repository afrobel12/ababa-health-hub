import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({ title, action, children, className, id }: { title: string; action?: ReactNode; children: ReactNode; className?: string; id: string }) {
  return (
    <section aria-labelledby={id} className={cn("rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id={id} className="font-display text-lg font-bold text-navy">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
