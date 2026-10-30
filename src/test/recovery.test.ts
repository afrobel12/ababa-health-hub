import { describe, expect, it } from "vitest";
import {
  RECOVERY_STEP_LABELS,
  validateNewPassword,
  validateRecoveryPhone,
} from "@/components/recovery/recovery-validation";
import { checkDemoCode } from "@/components/register/validation";

describe("recovery phone validation", () => {
  it("requires a phone number", () => {
    expect(validateRecoveryPhone({ phone: "" }).phone).toBe("Phone number is required.");
    expect(validateRecoveryPhone({ phone: "   " }).phone).toBe("Phone number is required.");
  });
  it("rejects invalid formats", () => {
    const msg = "Enter a valid Ethiopian mobile number, e.g. 0911 234 567.";
    expect(validateRecoveryPhone({ phone: "12345" }).phone).toBe(msg);
    expect(validateRecoveryPhone({ phone: "abcd" }).phone).toBe(msg);
    expect(validateRecoveryPhone({ phone: "0811 234 567" }).phone).toBe(msg);
  });
  it("accepts valid Ethiopian mobile numbers", () => {
    expect(validateRecoveryPhone({ phone: "0911 234 567" })).toEqual({});
    expect(validateRecoveryPhone({ phone: "+251911234567" })).toEqual({});
    expect(validateRecoveryPhone({ phone: "911234567" })).toEqual({});
  });
});

describe("new password validation", () => {
  it("requires both fields", () => {
    expect(validateNewPassword({ password: "", confirmPassword: "" })).toEqual({
      password: "Enter a new password.",
      confirmPassword: "Please re-enter your new password.",
    });
  });
  it("enforces the 12-character minimum", () => {
    expect(validateNewPassword({ password: "short", confirmPassword: "short" }).password).toBe(
      "Password must be at least 12 characters.",
    );
  });
  it("rejects mismatched confirmation", () => {
    expect(
      validateNewPassword({ password: "a-long-enough-password", confirmPassword: "different-password" })
        .confirmPassword,
    ).toBe("Passwords do not match.");
  });
  it("accepts a matching long password", () => {
    expect(validateNewPassword({ password: "a-long-enough-password", confirmPassword: "a-long-enough-password" })).toEqual({});
  });
});

describe("recovery demo code", () => {
  it("accepts the demonstration code", () => {
    expect(checkDemoCode("123456", false)).toBe("ok");
  });
  it("rejects wrong, incomplete and expired codes", () => {
    expect(checkDemoCode("000000", false)).toBe("incorrect");
    expect(checkDemoCode("123", false)).toBe("incomplete");
    expect(checkDemoCode("", false)).toBe("empty");
    expect(checkDemoCode("123456", true)).toBe("expired");
  });
});

describe("recovery steps", () => {
  it("has four labelled stages", () => {
    expect([...RECOVERY_STEP_LABELS]).toEqual(["Phone", "Verification", "New Password", "Complete"]);
  });
});
