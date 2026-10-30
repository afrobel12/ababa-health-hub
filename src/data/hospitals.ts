// Synthetic frontend-only demonstration data for the public hospital directory.
// Every listing is fictional; map positions are approximate schematic points,
// not real locations. Do not replace with real hospital data in this phase.
import illustration1 from "@/assets/hospital-illustration-1.jpg";
import illustration2 from "@/assets/hospital-illustration-2.jpg";

export type HospitalType = "Public" | "Private";
export type TypeFilter = "all" | "public" | "private";
export type SortOption = "name-asc" | "name-desc" | "city-asc";

export type Hospital = {
  id: string;
  slug: string;
  name: string;
  type: HospitalType;
  city: string;
  region: string;
  departments: string[];
  description: string;
  image: string;
  imageAlt: string;
  /** Synthetic position on the schematic demonstration map (viewBox 400x320). */
  map: { x: number; y: number };
};

export const CITIES = ["Addis Ababa", "Adama", "Bahir Dar", "Dire Dawa", "Hawassa", "Mekelle"] as const;

export const DEPARTMENTS = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Orthopedics",
  "Gynecology",
  "Dermatology",
  "Emergency Care",
  "Surgery",
] as const;

const ALT_1 = "Illustration of a modern hospital building";
const ALT_2 = "Illustration of a community clinic building";

export const MOCK_HOSPITALS: Hospital[] = [
  // Addis Ababa
  { id: "h01", slug: "demo-addis-medical-center", name: "Demo Addis Medical Center", type: "Private", city: "Addis Ababa", region: "Addis Ababa", departments: ["General Medicine", "Cardiology", "Pediatrics"], description: "Fictional multi-specialty hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 192, y: 168 } },
  { id: "h02", slug: "demo-central-addis-health-centre", name: "Demo Central Addis Health Centre", type: "Public", city: "Addis Ababa", region: "Addis Ababa", departments: ["General Medicine", "Emergency Care"], description: "Fictional public health centre demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 207, y: 159 } },
  { id: "h03", slug: "demo-kazanchis-specialist-hospital", name: "Demo Kazanchis Specialist Hospital", type: "Private", city: "Addis Ababa", region: "Addis Ababa", departments: ["Cardiology", "Surgery", "Orthopedics"], description: "Fictional specialist hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 178, y: 177 } },
  { id: "h04", slug: "demo-addis-family-clinic", name: "Demo Addis Family Clinic", type: "Private", city: "Addis Ababa", region: "Addis Ababa", departments: ["Pediatrics", "Gynecology", "Dermatology"], description: "Fictional family clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 201, y: 181 } },
  // Adama
  { id: "h05", slug: "demo-adama-general-hospital", name: "Demo Adama General Hospital", type: "Public", city: "Adama", region: "Oromia", departments: ["General Medicine", "Surgery", "Emergency Care"], description: "Fictional general hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 228, y: 202 } },
  { id: "h06", slug: "demo-rift-valley-specialist-hospital", name: "Demo Rift Valley Specialist Hospital", type: "Private", city: "Adama", region: "Oromia", departments: ["Orthopedics", "Cardiology"], description: "Fictional specialist hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 243, y: 193 } },
  { id: "h07", slug: "demo-adama-mother-child-clinic", name: "Demo Adama Mother & Child Clinic", type: "Private", city: "Adama", region: "Oromia", departments: ["Gynecology", "Pediatrics"], description: "Fictional mother and child clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 214, y: 211 } },
  { id: "h08", slug: "demo-east-shewa-medical-center", name: "Demo East Shewa Medical Center", type: "Public", city: "Adama", region: "Oromia", departments: ["General Medicine", "Dermatology"], description: "Fictional medical center demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 237, y: 215 } },
  // Bahir Dar
  { id: "h09", slug: "demo-bahir-dar-hospital", name: "Demo Bahir Dar Hospital", type: "Public", city: "Bahir Dar", region: "Amhara", departments: ["General Medicine", "Surgery"], description: "Fictional general hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 118, y: 92 } },
  { id: "h10", slug: "demo-blue-nile-family-clinic", name: "Demo Blue Nile Family Clinic", type: "Private", city: "Bahir Dar", region: "Amhara", departments: ["Pediatrics", "General Medicine", "Dermatology"], description: "Fictional family clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 133, y: 83 } },
  { id: "h11", slug: "demo-lake-tana-medical-center", name: "Demo Lake Tana Medical Center", type: "Private", city: "Bahir Dar", region: "Amhara", departments: ["Cardiology", "Gynecology"], description: "Fictional medical center demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 104, y: 101 } },
  { id: "h12", slug: "demo-amhara-lakeside-hospital", name: "Demo Amhara Lakeside Hospital", type: "Public", city: "Bahir Dar", region: "Amhara", departments: ["Emergency Care", "Orthopedics", "General Medicine"], description: "Fictional lakeside hospital demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 127, y: 105 } },
  // Dire Dawa
  { id: "h13", slug: "demo-dire-dawa-care-center", name: "Demo Dire Dawa Care Center", type: "Public", city: "Dire Dawa", region: "Dire Dawa", departments: ["General Medicine", "Emergency Care"], description: "Fictional care center demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 312, y: 138 } },
  { id: "h14", slug: "demo-harar-gate-clinic", name: "Demo Harar Gate Clinic", type: "Private", city: "Dire Dawa", region: "Dire Dawa", departments: ["Dermatology", "Pediatrics"], description: "Fictional clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 327, y: 129 } },
  { id: "h15", slug: "demo-dire-dawa-specialist-hospital", name: "Demo Dire Dawa Specialist Hospital", type: "Private", city: "Dire Dawa", region: "Dire Dawa", departments: ["Surgery", "Cardiology", "Orthopedics"], description: "Fictional specialist hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 298, y: 147 } },
  { id: "h16", slug: "demo-eastern-gateway-health-centre", name: "Demo Eastern Gateway Health Centre", type: "Public", city: "Dire Dawa", region: "Dire Dawa", departments: ["General Medicine", "Gynecology"], description: "Fictional health centre demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 321, y: 151 } },
  // Hawassa
  { id: "h17", slug: "demo-hawassa-medical-center", name: "Demo Hawassa Medical Center", type: "Public", city: "Hawassa", region: "Sidama", departments: ["General Medicine", "Pediatrics", "Surgery"], description: "Fictional medical center demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 192, y: 252 } },
  { id: "h18", slug: "demo-lake-hawassa-clinic", name: "Demo Lake Hawassa Clinic", type: "Private", city: "Hawassa", region: "Sidama", departments: ["Dermatology", "Gynecology"], description: "Fictional clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 207, y: 243 } },
  { id: "h19", slug: "demo-sidama-specialist-hospital", name: "Demo Sidama Specialist Hospital", type: "Private", city: "Hawassa", region: "Sidama", departments: ["Cardiology", "Orthopedics"], description: "Fictional specialist hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 178, y: 261 } },
  { id: "h20", slug: "demo-hawassa-community-health-centre", name: "Demo Hawassa Community Health Centre", type: "Public", city: "Hawassa", region: "Sidama", departments: ["General Medicine", "Emergency Care", "Pediatrics"], description: "Fictional community health centre demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 201, y: 265 } },
  // Mekelle
  { id: "h21", slug: "demo-mekelle-general-hospital", name: "Demo Mekelle General Hospital", type: "Public", city: "Mekelle", region: "Tigray", departments: ["General Medicine", "Surgery", "Emergency Care"], description: "Fictional general hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 248, y: 52 } },
  { id: "h22", slug: "demo-highland-specialist-clinic", name: "Demo Highland Specialist Clinic", type: "Private", city: "Mekelle", region: "Tigray", departments: ["Cardiology", "Dermatology"], description: "Fictional specialist clinic demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 263, y: 43 } },
  { id: "h23", slug: "demo-tigray-family-health-center", name: "Demo Tigray Family Health Center", type: "Private", city: "Mekelle", region: "Tigray", departments: ["Pediatrics", "Gynecology"], description: "Fictional family health center demonstration.", image: illustration2, imageAlt: ALT_2, map: { x: 234, y: 61 } },
  { id: "h24", slug: "demo-mekelle-care-hospital", name: "Demo Mekelle Care Hospital", type: "Public", city: "Mekelle", region: "Tigray", departments: ["Orthopedics", "General Medicine"], description: "Fictional care hospital demonstration.", image: illustration1, imageAlt: ALT_1, map: { x: 257, y: 65 } },
];

// ---------------------------------------------------------------------------
// Slugs (URL-safe filter values)
// ---------------------------------------------------------------------------

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const cityFromSlug = (slug: string) => CITIES.find((c) => slugify(c) === slug) ?? "";
export const deptFromSlug = (slug: string) => DEPARTMENTS.find((d) => slugify(d) === slug) ?? "";

// ---------------------------------------------------------------------------
// Filtering, sorting, pagination
// ---------------------------------------------------------------------------

export type DirectoryFilters = { city: string; type: TypeFilter; department: string; q: string };

export const DEFAULT_FILTERS: DirectoryFilters = { city: "", type: "all", department: "", q: "" };

export function filterHospitals(list: Hospital[], f: DirectoryFilters): Hospital[] {
  const q = f.q.trim().toLowerCase();
  return list.filter(
    (h) =>
      (!f.city || h.city === f.city) &&
      (f.type === "all" || h.type.toLowerCase() === f.type) &&
      (!f.department || h.departments.includes(f.department)) &&
      (!q || h.name.toLowerCase().includes(q)),
  );
}

export function sortHospitals(list: Hospital[], sort: SortOption): Hospital[] {
  const sorted = [...list];
  if (sort === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
  else sorted.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
  return sorted;
}

export const PAGE_SIZE = 6;

export function countActiveFilters(f: DirectoryFilters): number {
  return (f.city ? 1 : 0) + (f.type !== "all" ? 1 : 0) + (f.department ? 1 : 0) + (f.q.trim() ? 1 : 0);
}

// ---------------------------------------------------------------------------
// URL search-param mapping (only non-default values are placed in the URL)
// ---------------------------------------------------------------------------

export type DirectorySearch = { city?: string; department?: string; type?: TypeFilter; q?: string };

export function filtersToSearch(f: DirectoryFilters): DirectorySearch {
  const s: DirectorySearch = {};
  if (f.city) s.city = slugify(f.city);
  if (f.department) s.department = slugify(f.department);
  if (f.type !== "all") s.type = f.type;
  if (f.q.trim()) s.q = f.q.trim();
  return s;
}

export function filtersFromSearch(s: { city?: string; department?: string; type?: string; q?: string }): DirectoryFilters {
  return {
    city: s.city ? cityFromSlug(s.city) : "",
    department: s.department ? deptFromSlug(s.department) : "",
    type: s.type === "public" || s.type === "private" ? s.type : "all",
    q: typeof s.q === "string" ? s.q : "",
  };
}

/** Homepage search form → directory URL params; only selected filters included. */
export function buildDirectorySearch(input: { city: string; department: string; name: string }): DirectorySearch {
  return filtersToSearch({
    city: input.city,
    department: input.department,
    type: "all",
    q: input.name,
  });
}
