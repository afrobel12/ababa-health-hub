import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import {
  MOCK_PATIENT,
  UNREAD_NOTIFICATION_COUNT,
  addisDateTime,
  ageFromDob,
  appointmentSummary,
  buildAppointments,
  buildMedicalHistory,
  buildNotifications,
  formatTime,
} from "@/data/patient-demo";
import { MOCK_HOSPITALS } from "@/data/hospitals";
import { patientBottomNav, patientMoreNav, patientPrimaryNav, patientUtilityNav } from "@/config/patient-navigation";
import { demoProfiles } from "@/data/demo-accounts";
import { MedicalHistoryPreview } from "@/components/patient/medical-history-preview";
import { ComingSoonProvider } from "@/components/home/coming-soon";

// Fixed instant: 2 Nov 2026, 21:30 Addis (18:30 UTC).
const NOW = new Date("2026-11-02T18:30:00Z");

describe("patient routing", () => {
  it("matches /patient to the dashboard leaf", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/patient").at(-1)?.routeId).toBe("/patient/");
  });
  it("only the patient demo workspace targets the Patient Dashboard", () => {
    const patientWs = demoProfiles.flatMap((p) => p.workspaces).filter((w) => w.destination === "Patient Dashboard");
    expect(patientWs.every((w) => w.role === "patient")).toBe(true);
  });
});

describe("patient navigation", () => {
  it("lists the seven primary items in order", () => {
    expect(patientPrimaryNav.map((n) => n.label)).toEqual([
      "Dashboard", "Appointments", "Find Hospitals", "Medical History", "Dependents", "Notifications", "My Profile",
    ]);
    expect(patientUtilityNav.map((n) => n.label)).toEqual(["Settings", "Help & Support"]);
  });
  it("bottom bar has Home, Visits, Find, Records (+ More)", () => {
    expect(patientBottomNav.map((n) => n.mobileLabel)).toEqual(["Home", "Visits", "Find", "Records"]);
    expect(patientMoreNav.map((n) => n.label)).toEqual(["Dependents", "Notifications", "My Profile", "Settings", "Help & Support"]);
  });
  it("Dashboard, Appointments and Find Hospitals navigate; the rest are future notices", () => {
    const built = patientPrimaryNav.filter((n) => n.to).map((n) => n.to);
    expect(built).toEqual(["/patient", "/patient/appointments", "/hospitals"]);
  });
});

describe("patient demo data", () => {
  it("derives age from date of birth", () => {
    expect(ageFromDob("1992-03-14", NOW)).toBe(34);
    expect(ageFromDob("1992-11-03", NOW)).toBe(33);
    expect(ageFromDob("1992-11-02", NOW)).toBe(34);
  });

  it("orders upcoming appointments and excludes past ones", () => {
    const list = buildAppointments(NOW);
    const { upcoming, past, next } = appointmentSummary(list, NOW);
    expect(upcoming.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
    expect(upcoming.every((a) => a.appointmentDateTime > NOW)).toBe(true);
    expect(past).toHaveLength(4);
    expect(next?.id).toBe("a1");
  });

  it("an appointment that just passed is no longer upcoming", () => {
    const list = buildAppointments(NOW);
    const later = new Date(list.find((a) => a.id === "a1")!.appointmentDateTime.getTime() + 60_000);
    expect(appointmentSummary(list, later).next?.id).toBe("a2");
  });

  it("shows appointment times in Addis Ababa time", () => {
    const d = addisDateTime(NOW, 3, 9, 30);
    expect(d.toISOString()).toBe("2026-11-05T06:30:00.000Z");
    expect(formatTime(d)).toBe("9:30 AM");
  });

  it("links appointments to existing hospitals and matching doctors", () => {
    for (const a of buildAppointments(NOW)) {
      expect(MOCK_HOSPITALS).toContain(a.hospital);
      expect(a.hospital.departments).toContain(a.department);
      expect(a.patientId).toBe(MOCK_PATIENT.id);
      if (a.doctorId) {
        expect(a.doctor?.hospitalId).toBe(a.hospitalId);
        expect(a.doctor?.department).toBe(a.department);
      }
    }
  });

  it("unread count matches the notification list and notices match appointment status", () => {
    const list = buildAppointments(NOW);
    const notes = buildNotifications(NOW, list);
    expect(UNREAD_NOTIFICATION_COUNT).toBe(notes.filter((n) => !n.read).length);
    expect(UNREAD_NOTIFICATION_COUNT).toBe(2);
    const resched = notes.find((n) => n.category === "reschedule")!;
    expect(list.find((a) => a.id === resched.appointmentId)?.status).toBe("Rescheduled");
    const booked = notes.find((n) => n.category === "booking")!;
    expect(list.find((a) => a.id === booked.appointmentId)?.status).toBe("Booked");
  });

  it("groups medical history by hospital with counts of available visits only", () => {
    const groups = buildMedicalHistory(NOW);
    expect(groups.map((g) => g.hospital.id)).toEqual(["h01", "h05", "h03"]);
    expect(groups.map((g) => g.visibleCount)).toEqual([2, 1, 1]);
    for (const g of groups) expect(MOCK_HOSPITALS).toContain(g.hospital);
  });
});

describe("medical history preview", () => {
  it("does not expose restricted or unshared visit contents", async () => {
    render(
      <ComingSoonProvider>
        <MedicalHistoryPreview groups={buildMedicalHistory(NOW)} />
      </ComingSoonProvider>,
    );
    const groups = screen.getAllByTestId("history-group");
    const first = groups[0]!;
    fireEvent.click(within(first).getByRole("button"));
    expect(await within(first).findByText("Details restricted by the hospital.")).toBeInTheDocument();
    expect(within(first).getAllByText(/Available to patient/)).toHaveLength(2);
    expect(within(first).getByTestId("visible-count").textContent).toBe("2");
  });
});
