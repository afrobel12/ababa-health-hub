import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PatientWorkspaceLayout } from "@/components/patient/workspace-layout";

// Layout for all patient screens. Demo only: no session or permission check.
export const Route = createFileRoute("/patient")({
  component: PatientLayoutRoute,
});

function PatientLayoutRoute() {
  return (
    <PatientWorkspaceLayout>
      <Outlet />
    </PatientWorkspaceLayout>
  );
}
