// Single in-memory appointment state shared by every patient screen (P-01, P-02).
// Lives in the /patient layout, so it survives navigation between patient pages
// and resets on refresh. Nothing is persisted, fetched or sent.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildAppointments, type Appointment } from "@/data/patient-demo";
import {
  cancelAppointment,
  getPastAppointments,
  getUpcomingAppointments,
  rescheduleAppointment,
  type TransitionResult,
} from "@/data/patient-appointments";

type Ctx = {
  /** Null during SSR and the first client render (see useDemoNow). */
  now: Date | null;
  appointments: Appointment[] | null;
  getAppointmentById: (id: string) => Appointment | undefined;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  cancelDemoAppointment: (id: string) => TransitionResult;
  rescheduleDemoAppointment: (id: string, newTime: Date) => TransitionResult;
  resetDemoAppointments: () => void;
};

const AppointmentsCtx = createContext<Ctx | null>(null);

export function PatientAppointmentsProvider({ children, initialNow }: { children: ReactNode; initialNow?: Date }) {
  const [now, setNow] = useState<Date | null>(initialNow ?? null);
  const [appointments, setAppointments] = useState<Appointment[] | null>(initialNow ? buildAppointments(initialNow) : null);

  useEffect(() => {
    if (initialNow) return;
    const n = new Date();
    setNow(n);
    setAppointments(buildAppointments(n));
  }, [initialNow]);

  const fail: TransitionResult = { ok: false, error: "Appointments are still loading." };

  const cancelDemoAppointment = useCallback(
    (id: string) => {
      if (!appointments || !now) return fail;
      const r = cancelAppointment(appointments, id, now);
      if (r.ok) setAppointments(r.appointments);
      return r;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments, now],
  );
  const rescheduleDemoAppointment = useCallback(
    (id: string, newTime: Date) => {
      if (!appointments || !now) return fail;
      const r = rescheduleAppointment(appointments, id, newTime, now);
      if (r.ok) setAppointments(r.appointments);
      return r;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments, now],
  );

  const value = useMemo<Ctx>(
    () => ({
      now,
      appointments,
      getAppointmentById: (id) => appointments?.find((a) => a.id === id),
      getUpcomingAppointments: () => (appointments && now ? getUpcomingAppointments(appointments, now) : []),
      getPastAppointments: () => (appointments && now ? getPastAppointments(appointments, now) : []),
      cancelDemoAppointment,
      rescheduleDemoAppointment,
      resetDemoAppointments: () => now && setAppointments(buildAppointments(now)),
    }),
    [now, appointments, cancelDemoAppointment, rescheduleDemoAppointment],
  );

  return <AppointmentsCtx.Provider value={value}>{children}</AppointmentsCtx.Provider>;
}

export function usePatientAppointments(): Ctx {
  const ctx = useContext(AppointmentsCtx);
  if (!ctx) throw new Error("usePatientAppointments must be used inside PatientAppointmentsProvider");
  return ctx;
}
