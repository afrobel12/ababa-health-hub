import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import {
  CITIES,
  DEFAULT_FILTERS,
  DEPARTMENTS,
  MOCK_HOSPITALS,
  PAGE_SIZE,
  buildDirectorySearch,
  cityFromSlug,
  countActiveFilters,
  deptFromSlug,
  filterHospitals,
  filtersFromSearch,
  filtersToSearch,
  slugify,
  sortHospitals,
} from "@/data/hospitals";

describe("synthetic hospital dataset", () => {
  it("contains exactly 24 fictional listings", () => {
    expect(MOCK_HOSPITALS).toHaveLength(24);
  });
  it("uses unique ids and slugs", () => {
    expect(new Set(MOCK_HOSPITALS.map((h) => h.id)).size).toBe(24);
    expect(new Set(MOCK_HOSPITALS.map((h) => h.slug)).size).toBe(24);
  });
  it("marks every listing as fictional with a Demo name", () => {
    expect(MOCK_HOSPITALS.every((h) => h.name.startsWith("Demo "))).toBe(true);
  });
  it("only uses known cities and departments", () => {
    for (const h of MOCK_HOSPITALS) {
      expect(CITIES).toContain(h.city);
      for (const d of h.departments) expect(DEPARTMENTS).toContain(d);
    }
  });
});

describe("filterHospitals", () => {
  it("filters by city", () => {
    const r = filterHospitals(MOCK_HOSPITALS, { ...DEFAULT_FILTERS, city: "Adama" });
    expect(r).toHaveLength(4);
    expect(r.every((h) => h.city === "Adama")).toBe(true);
  });
  it("filters by hospital type", () => {
    const r = filterHospitals(MOCK_HOSPITALS, { ...DEFAULT_FILTERS, type: "public" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.type === "Public")).toBe(true);
  });
  it("filters by department", () => {
    const r = filterHospitals(MOCK_HOSPITALS, { ...DEFAULT_FILTERS, department: "Cardiology" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.departments.includes("Cardiology"))).toBe(true);
  });
  it("searches names case-insensitively and ignores surrounding whitespace", () => {
    const r = filterHospitals(MOCK_HOSPITALS, { ...DEFAULT_FILTERS, q: "  blue nile " });
    expect(r.map((h) => h.name)).toEqual(["Demo Blue Nile Family Clinic"]);
  });
  it("combines filters with AND semantics", () => {
    const r = filterHospitals(MOCK_HOSPITALS, { city: "Addis Ababa", type: "private", department: "Cardiology", q: "" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.city === "Addis Ababa" && h.type === "Private" && h.departments.includes("Cardiology"))).toBe(true);
  });
  it("returns an empty list when nothing matches", () => {
    expect(filterHospitals(MOCK_HOSPITALS, { ...DEFAULT_FILTERS, q: "zzz-no-such-hospital" })).toEqual([]);
  });
});

describe("sortHospitals", () => {
  const sample = MOCK_HOSPITALS.slice(0, 8);
  it("sorts by name A–Z and Z–A", () => {
    const asc = sortHospitals(sample, "name-asc").map((h) => h.name);
    expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b)));
    const desc = sortHospitals(sample, "name-desc").map((h) => h.name);
    expect(desc).toEqual([...asc].reverse());
  });
  it("sorts by city A–Z", () => {
    const r = sortHospitals(sample, "city-asc").map((h) => h.city);
    expect(r).toEqual([...r].sort((a, b) => a.localeCompare(b)));
  });
  it("does not mutate the input list", () => {
    const before = sample.map((h) => h.id);
    sortHospitals(sample, "name-desc");
    expect(sample.map((h) => h.id)).toEqual(before);
  });
});

describe("URL search mapping", () => {
  it("omits default filters from the URL", () => {
    expect(filtersToSearch(DEFAULT_FILTERS)).toEqual({});
  });
  it("maps filters to slugged params and back", () => {
    const f = { city: "Addis Ababa", type: "private" as const, department: "Emergency Care", q: "demo" };
    const s = filtersToSearch(f);
    expect(s).toEqual({ city: "addis-ababa", department: "emergency-care", type: "private", q: "demo" });
    expect(filtersFromSearch(s)).toEqual(f);
  });
  it("falls back to defaults for unknown or invalid params", () => {
    expect(filtersFromSearch({ city: "atlantis", department: "alchemy", type: "charity" })).toEqual(DEFAULT_FILTERS);
  });
  it("slug round-trips every city and department", () => {
    for (const c of CITIES) expect(cityFromSlug(slugify(c))).toBe(c);
    for (const d of DEPARTMENTS) expect(deptFromSlug(slugify(d))).toBe(d);
  });
  it("homepage search only includes selected filters", () => {
    expect(buildDirectorySearch({ city: "Addis Ababa", department: "Cardiology", name: "" })).toEqual({
      city: "addis-ababa",
      department: "cardiology",
    });
    expect(buildDirectorySearch({ city: "", department: "", name: " nile " })).toEqual({ q: "nile" });
  });
});

describe("pagination and active-filter counting", () => {
  it("shows six hospitals per page", () => {
    expect(PAGE_SIZE).toBe(6);
    expect(MOCK_HOSPITALS.slice(0, PAGE_SIZE)).toHaveLength(6);
  });
  it("counts only non-default filters", () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(countActiveFilters({ city: "Adama", type: "public", department: "", q: "  " })).toBe(2);
    expect(countActiveFilters({ city: "Adama", type: "public", department: "Surgery", q: "clinic" })).toBe(4);
  });
});

describe("directory routing", () => {
  it("matches a page for /hospitals instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/hospitals");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
