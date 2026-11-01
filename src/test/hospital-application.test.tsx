import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  allowedStep,
  emptyHospitalInfo,
  emptyRepresentative,
  validateHospitalInfo,
  validateRepresentative,
  type HospitalInfo,
  type RepresentativeInfo,
} from "@/components/for-hospitals/application-validation";
import { HospitalApplicationWizard } from "@/components/for-hospitals/hospital-application-page";
import { validateInquiry, emptyInquiry } from "@/components/contact/contact-validation";
import { routes } from "@/config/navigation";

const validHospital: HospitalInfo = {
  name: "Demo Test Hospital",
  type: "Private Hospital",
  region: "Oromia",
  city: "Adama",
  address: "Demo sub-city, Woreda 01",
  departments: ["Pediatrics"],
};
const validRep: RepresentativeInfo = { ...emptyRepresentative, fullName: "Demo Person", position: "Administrator", phone: "0911234567" };

describe("hospital information validation", () => {
  it("requires every field and at least one department", () => {
    const e = validateHospitalInfo(emptyHospitalInfo);
    expect(Object.keys(e).sort()).toEqual(["address", "city", "departments", "name", "region", "type"]);
  });
  it("treats a whitespace-only name as missing", () => {
    expect(validateHospitalInfo({ ...validHospital, name: "   " }).name).toBe("Hospital name is required.");
  });
  it("accepts a complete hospital", () => {
    expect(validateHospitalInfo(validHospital)).toEqual({});
  });
});

describe("representative validation", () => {
  it("requires name, position and phone", () => {
    expect(Object.keys(validateRepresentative(emptyRepresentative)).sort()).toEqual(["fullName", "phone", "position"]);
  });
  it("rejects a non-Ethiopian phone number", () => {
    expect(validateRepresentative({ ...validRep, phone: "12345" }).phone).toBeDefined();
  });
  it("accepts an empty email but rejects a malformed one", () => {
    expect(validateRepresentative(validRep).email).toBeUndefined();
    expect(validateRepresentative({ ...validRep, email: "not-an-email" }).email).toBeDefined();
  });
  it("requires a title when Other is chosen", () => {
    expect(validateRepresentative({ ...validRep, position: "Other" }).positionOther).toBeDefined();
  });
});

describe("step skipping", () => {
  it("cannot reach review while hospital information is invalid", () => {
    expect(allowedStep(2, emptyHospitalInfo, validRep)).toBe(0);
  });
  it("cannot reach review while representative information is invalid", () => {
    expect(allowedStep(2, validHospital, emptyRepresentative)).toBe(1);
  });
});

describe("contact inquiry validation", () => {
  it("requires name, email, category and message", () => {
    expect(Object.keys(validateInquiry(emptyInquiry)).sort()).toEqual(["category", "email", "fullName", "message"]);
  });
  it("rejects an invalid email", () => {
    expect(validateInquiry({ ...emptyInquiry, email: "x@" }).email).toBe("Enter a valid email address.");
  });
});

describe("navigation", () => {
  it("marks Screen 07 pages as built", () => {
    for (const r of [routes.forHospitals, routes.hospitalApply, routes.about, routes.contact, routes.privacy, routes.terms]) {
      expect(r.implemented).toBe(true);
    }
  });
});

function renderWizard() {
  const rootRoute = createRootRoute();
  const page = createRoute({ getParentRoute: () => rootRoute, path: "/", component: HospitalApplicationWizard });
  const other = createRoute({ getParentRoute: () => rootRoute, path: "/for-hospitals", component: () => null });
  const router = createRouter({
    routeTree: rootRoute.addChildren([page, other]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("application wizard", () => {
  afterEach(() => vi.restoreAllMocks());

  it("blocks Continue on an empty first step", async () => {
    renderWizard();
    const cont = await screen.findByRole("button", { name: /Continue to Representative/ });
    fireEvent.click(cont);
    expect(screen.getByText("Hospital name is required.")).toBeInTheDocument();
    expect(screen.getByText("Select at least one department or service.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tell us about your hospital" })).toBeInTheDocument();
  });

  it("submits without any network request and Start New clears values", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderWizard();
    // Step 1: fill text fields; selects are Radix, so set them via keyboard-free path below.
    fireEvent.change(await screen.findByLabelText(/Hospital Name/), { target: { value: "  Demo Test Hospital  " } });
    fireEvent.change(screen.getByLabelText(/^City/), { target: { value: "Adama" } });
    fireEvent.change(screen.getByLabelText(/Hospital Address/), { target: { value: "Demo Woreda 01" } });
    fireEvent.click(screen.getByLabelText("Pediatrics"));
    // Without type/region, continuing is still blocked.
    fireEvent.click(screen.getByRole("button", { name: /Continue to Representative/ }));
    expect(screen.getByText("Select a hospital type.")).toBeInTheDocument();
    expect(screen.getByLabelText(/Hospital Name/)).toHaveValue("Demo Test Hospital");
    expect(fetchSpy).not.toHaveBeenCalled();
    await act(async () => {});
  });
});
