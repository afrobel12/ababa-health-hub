import { useState } from "react";
import { ChevronDown, Hospital, Lock } from "lucide-react";
import { useComingSoon } from "@/components/home/coming-soon";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { futureTarget, patientNav } from "@/config/patient-navigation";
import { formatShortDate, type HospitalHistoryGroup } from "@/data/patient-demo";
import { cn } from "@/lib/utils";
import { DashboardCard } from "./dashboard-page";
import { AccessBadge } from "./status-badge";

export function MedicalHistoryPreview({ groups }: { groups: HospitalHistoryGroup[] }) {
  const open = useComingSoon();
  return (
    <DashboardCard
      id="history-heading"
      title="Medical History"
      action={
        <Button variant="link" className="h-auto p-0" onClick={() => open(futureTarget("Medical History", patientNav.medicalHistory.plannedPath))}>
          View History
        </Button>
      }
    >
      <p className="-mt-2 mb-4 text-sm text-muted-foreground">
        Fictional demo records, grouped by hospital. Only information each hospital has made available to you appears here.
      </p>
      <ul className="space-y-3">
        {groups.map((g) => (
          <li key={g.hospital.id}>
            <HospitalGroup group={g} />
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

function HospitalGroup({ group }: { group: HospitalHistoryGroup }) {
  const [open, setOpen] = useState(false);
  const { hospital, visits, visibleCount, latestVisibleDate } = group;
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border border-border" data-testid="history-group">
      <h3>
        <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-soft text-teal">
            <Hospital className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-foreground">{hospital.name}</span>
            <span className="block text-sm text-muted-foreground">
              <span data-testid="visible-count">{visibleCount}</span> available visit{visibleCount === 1 ? "" : "s"}
              {latestVisibleDate && <> · Latest {formatShortDate(latestVisibleDate)}</>}
            </span>
          </span>
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
        </CollapsibleTrigger>
      </h3>
      <CollapsibleContent>
        <ul className="space-y-2 border-t border-border p-3 sm:p-4">
          {visits.map((v) => (
            <li key={v.id} className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{formatShortDate(v.date)}</p>
                {v.access === "available" ? (
                  <p className="text-muted-foreground">
                    {v.department} · {v.summary}
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    {v.access === "restricted" ? "Details restricted by the hospital." : "This hospital has not shared this visit."}
                  </p>
                )}
              </div>
              <AccessBadge access={v.access} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
