import { describe, expect, it } from "vitest";
import {
  calcAge,
  checkDemoCode,
  isUnderage,
  maskPhone,
  normalizeEthiopianPhone,
  validateAccount,
  validateIdentity,
  validatePersonal,
  DEMO_CODE,
} from "@/components/register/validation";

const today = new Date(2026, 9, 30); // 30 Oct 2026

describe("personal details validation", () => {
  const ok = { firstName: "Amina", middleName: "Bekele", surname: "Tesfaye", dob: "1990-05-10", gender: "Female" };
  it("blocks empty required fields", () => {
    const errs = validatePersonal({ firstName: " ", middleName: "", surname: "", dob: "", gender: "" }, today);
    expect(errs.firstName).toBeTruthy();
    expect(errs.middleName).toBeTruthy();
    expect(errs.surname).toBeTruthy();
    expect(errs.dob).toBeTruthy();
    expect(errs.gender).toBeTruthy();
  });
  it("rejects a future date of birth", () => {
    expect(validatePersonal({ ...ok, dob: "2099-01-01" }, today).dob).toBeTruthy();
  });
  it("rejects an invalid date", () => {
    expect(validatePersonal({ ...ok, dob: "1990-13-40" }, today).dob).toBeTruthy();
  });
  it("accepts a valid adult", () => {
    expect(validatePersonal(ok, today)).toEqual({});
  });
  it("calculates age from the date of birth", () => {
    expect(calcAge("1990-05-10", today)).toBe(36);
    expect(calcAge("1990-11-01", today)).toBe(35); // birthday not yet reached
  });
  it("flags under-18 self-registration for the child workflow", () => {
    expect(isUnderage({ ...ok, dob: "2015-01-01" }, today)).toBe(true);
    expect(isUnderage(ok, today)).toBe(false);
  });
});

describe("identity validation", () => {
  it("requires a national ID", () => {
    expect(validateIdentity({ nationalId: "  " }).nationalId).toBeTruthy();
  });
  it("accepts a reasonable value without enforcing an official format", () => {
    expect(validateIdentity({ nationalId: "ET-1234567" })).toEqual({});
  });
});

describe("account validation", () => {
  const ok = { phone: "0911 234 567", email: "", password: "twelve-chars!!", confirmPassword: "twelve-chars!!" };
  it("requires a phone number", () => {
    expect(validateAccount({ ...ok, phone: "" }).phone).toBeTruthy();
  });
  it("normalizes Ethiopian phone formats", () => {
    expect(normalizeEthiopianPhone("0911 234 567")).toBe("911234567");
    expect(normalizeEthiopianPhone("+251911234567")).toBe("911234567");
    expect(normalizeEthiopianPhone("911234567")).toBe("911234567");
    expect(normalizeEthiopianPhone("12345")).toBeNull();
  });
  it("masks phone numbers for display", () => {
    expect(maskPhone("911234567")).not.toContain("911234567");
  });
  it("validates email only when provided", () => {
    expect(validateAccount(ok).email).toBeUndefined();
    expect(validateAccount({ ...ok, email: "not-an-email" }).email).toBeTruthy();
  });
  it("requires a 12-character minimum password", () => {
    expect(validateAccount({ ...ok, password: "short", confirmPassword: "short" }).password).toBeTruthy();
  });
  it("requires matching password confirmation", () => {
    expect(validateAccount({ ...ok, confirmPassword: "different-one" }).confirmPassword).toBeTruthy();
  });
  it("accepts a valid account", () => {
    expect(validateAccount(ok)).toEqual({});
  });
});

describe("demo phone verification", () => {
  it("accepts the documented demonstration code", () => {
    expect(checkDemoCode(DEMO_CODE, false)).toBe("ok");
  });
  it("rejects empty, incomplete and incorrect codes", () => {
    expect(checkDemoCode("", false)).toBe("empty");
    expect(checkDemoCode("123", false)).toBe("incomplete");
    expect(checkDemoCode("000000", false)).toBe("incorrect");
  });
  it("treats an expired code as expired even when correct", () => {
    expect(checkDemoCode(DEMO_CODE, true)).toBe("expired");
  });
});
