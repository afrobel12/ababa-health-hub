import { describe, expect, it } from "vitest";
import { validateLogin } from "@/components/login/login-validation";
import { demoProfiles } from "@/data/demo-accounts";

describe("login validation", () => {
  it("requires phone and password", () => {
    expect(validateLogin({ phone: "", password: "" })).toEqual({
      phone: "Enter your phone number.",
      password: "Enter your password.",
    });
  });
  it("rejects invalid phone", () => {
    expect(validateLogin({ phone: "12345", password: "x" }).phone).toBe("Enter a valid phone number.");
  });
  it("accepts a valid Ethiopian number", () => {
    expect(validateLogin({ phone: "911 234 567", password: "x" })).toEqual({});
  });
});

describe("demo profiles", () => {
  it("covers all five roles", () => {
    const roles = new Set(demoProfiles.flatMap((p) => p.workspaces.map((w) => w.role)));
    expect([...roles].sort()).toEqual(["admin", "doctor", "manager", "patient", "receptionist"]);
  });
  it("includes a multi-workspace example", () => {
    expect(demoProfiles.some((p) => p.workspaces.length === 2)).toBe(true);
  });
});
