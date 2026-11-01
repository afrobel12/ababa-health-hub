import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { validateSearch } from "@/data/search-options";
import { ComingSoonProvider, NavLink } from "@/components/home/coming-soon";
import { routes } from "@/config/navigation";

describe("hospital search validation", () => {
  it("blocks an empty search", () => {
    expect(validateSearch({ city: "", department: "", name: "  " }).ok).toBe(false);
  });
  it("accepts a city-only search", () => {
    expect(validateSearch({ city: "Adama", department: "", name: "" })).toEqual({ ok: true, summary: "Adama" });
  });
});

describe("unbuilt pages", () => {
  it("opens the coming-soon notice instead of navigating", () => {
    render(
      <ComingSoonProvider>
        <NavLink target={routes.help} />
      </ComingSoonProvider>,
    );
    fireEvent.click(screen.getByText("Help Center"));
    expect(screen.getByText("This page is coming in a future design phase.")).toBeTruthy();
  });
});
