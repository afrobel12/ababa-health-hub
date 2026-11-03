import type { ReactNode } from "react";
import { ComingSoonProvider } from "@/components/home/coming-soon";
import { PatientAppointmentsProvider } from "./appointments-provider";
import { PatientDemoIndicator, PatientTopHeader } from "./workspace-header";
import { PatientMobileBottomNav, PatientSidebar } from "./workspace-nav";

/** Shared shell for every patient screen: sidebar (lg+), header, bottom nav (<lg). */
export function PatientWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ComingSoonProvider>
      <PatientAppointmentsProvider>
      <div className="min-h-screen bg-sky">
        <PatientSidebar />
        <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
          <PatientTopHeader />
          <main
            id="patient-main"
            className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12"
          >
            <PatientDemoIndicator className="mb-4 xl:hidden" />
            {children}
          </main>
        </div>
        <PatientMobileBottomNav />
      </div>
      </PatientAppointmentsProvider>
    </ComingSoonProvider>
  );
}
