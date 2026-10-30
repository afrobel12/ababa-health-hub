import { describe, expect, it } from "vitest";
import { MOCK_HOSPITALS } from "@/data/hospitals";
import { canPreview, changeDepartment, changeDoctor, demoDateWindow, demoSlots, doctorsFor, EMPTY_SELECTION, findHospital, isDemoDate, localDateKey, MOCK_DOCTORS } from "@/data/hospital-details";
const hospital = MOCK_HOSPITALS[0];
if (!hospital) throw new Error("Missing demo hospital");
const now = new Date(2026, 9, 30, 10, 30);
const selection = { department: "Cardiology", doctorId: "", date: "2026-10-31", time: "" };
describe("hospital detail relationships", () => {
  it("resolves existing slugs and never substitutes an unknown hospital", () => {
    expect(findHospital("demo-addis-medical-center")).toBe(hospital);
    expect(findHospital("missing-hospital")).toBeUndefined();
  });
  it("keeps every doctor in its existing hospital and department", () => {
    for (const doctor of MOCK_DOCTORS) {
      const owner = MOCK_HOSPITALS.find((h) => h.id === doctor.hospitalId);
      expect(owner?.departments).toContain(doctor.department);
    }
    expect(doctorsFor("h01").every((d) => d.hospitalId === "h01" && d.published)).toBe(true);
  });
  it("supports a hospital with no published doctor profiles", () => expect(doctorsFor("h02")).toEqual([]));
  it("clears incompatible doctor, date and time on department change", () => {
    const result = changeDepartment({ ...selection, doctorId: "h01-doctor-2", time: "9:00" }, hospital, "Pediatrics");
    expect(result).toEqual({ department: "Pediatrics", doctorId: "", date: "", time: "" });
  });
  it("rejects departments outside the selected hospital", () => expect(changeDepartment(selection, hospital, "Surgery")).toEqual(EMPTY_SELECTION));
  it("selects a doctor's department and resets incompatible date/time", () => expect(changeDoctor({ ...selection, time: "9:00" }, hospital, "h01-doctor-3")).toEqual({ department: "Pediatrics", doctorId: "h01-doctor-3", date: "", time: "" }));
  it("rejects a doctor from another hospital", () => expect(changeDoctor(selection, hospital, "h03-doctor-1")).toEqual(selection));
  it("allows any doctor and clears selected time", () => expect(changeDoctor({ ...selection, doctorId: "h01-doctor-2", time: "9:00" }, hospital, "")).toEqual({ ...selection, time: "" }));
});
describe("local demonstration date and availability rules", () => {
  it("offers exactly 14 local dates starting today", () => {
    const window = demoDateWindow(now);
    expect(localDateKey(window.start)).toBe("2026-10-30");
    expect(localDateKey(window.end)).toBe("2026-11-12");
  });
  it("rejects past dates", () => expect(isDemoDate("2026-10-29", now)).toBe(false));
  it("rejects dates outside the short window", () => expect(isDemoDate("2026-11-13", now)).toBe(false));
  it("rejects invalid calendar dates", () => expect(isDemoDate("2026-02-31", now)).toBe(false));
  it("derives repeatable slots from the same selections", () => {
    expect(demoSlots(hospital, selection, now)).toEqual(demoSlots(hospital, { ...selection }, now));
    expect(demoSlots(hospital, selection, now).length).toBeGreaterThan(0);
  });
  it("does not offer past times today", () => {
    const slots = demoSlots(hospital, { ...selection, date: "2026-10-30" }, now);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots).not.toContain("9:00"); expect(slots).not.toContain("10:00");
  });
  it("has deterministic empty-availability days", () => {
    const dates = Array.from({ length: 14 }, (_, i) => { const day = new Date(now); day.setDate(day.getDate() + i); return localDateKey(day); });
    expect(dates.filter((date) => !demoSlots(hospital, { ...selection, date }, now).length).length).toBeGreaterThan(0);
  });
  it("requires department, date and a valid time but not a doctor", () => {
    expect(canPreview(hospital, EMPTY_SELECTION, now)).toBe(false);
    const time = demoSlots(hospital, selection, now)[0] ?? "";
    expect(canPreview(hospital, { ...selection, time }, now)).toBe(true);
    expect(canPreview(hospital, { ...selection, time: "3:15" }, now)).toBe(false);
  });
  it("never offers times for another hospital's doctor", () => expect(demoSlots(hospital, { ...selection, doctorId: "h03-doctor-1" }, now)).toEqual([]));
});