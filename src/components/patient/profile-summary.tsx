import { useComingSoon } from "@/components/home/coming-soon";
import { Button } from "@/components/ui/button";
import { futureTarget, patientNav } from "@/config/patient-navigation";
import { MOCK_PATIENT, ageFromDob, formatDob, formatShortDate, fullName, measurementSource } from "@/data/patient-demo";
import { DashboardCard } from "./dashboard-card";

export function PatientProfileSummary({ now }: { now: Date }) {
  const open = useComingSoon();
  const p = MOCK_PATIENT;
  const measure = (m: { value: number; unit: string; visitId: string } | undefined) => {
    if (!m) return { value: "Not recorded" };
    const src = measurementSource(m.visitId, now);
    return {
      value: `${m.value} ${m.unit}`,
      note: src ? `Measured ${formatShortDate(src.date)} · ${src.source}` : undefined,
    };
  };
  const rows: { term: string; value: string; note?: string | undefined }[] = [
    { term: "Full name", value: fullName(p) },
    { term: "Date of birth", value: formatDob(p.dateOfBirth) },
    { term: "Age", value: `${ageFromDob(p.dateOfBirth, now)} years` },
    { term: "Phone", value: p.phone, note: "Fictional test number" },
    { term: "Email", value: p.email || "Not provided" },
    { term: "Height", ...measure(p.height) },
    { term: "Weight", ...measure(p.weight) },
  ];
  return (
    <DashboardCard
      id="profile-heading"
      title="Your Profile Summary"
      action={
        <Button variant="link" className="h-auto p-0" onClick={() => open(futureTarget("My Profile", patientNav.profile.plannedPath))}>
          View Profile
        </Button>
      }
    >
      <dl className="divide-y divide-border text-sm">
        {rows.map((r) => (
          <div key={r.term} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5 first:pt-0 last:pb-0">
            <dt className="text-muted-foreground">{r.term}</dt>
            <dd className="min-w-0 break-words font-medium text-foreground">
              {r.value}
              {r.note && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{r.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </DashboardCard>
  );
}
