// UI-only demonstration options — not verified participating hospitals.
export const cityOptions = ["Addis Ababa", "Dire Dawa", "Adama", "Hawassa", "Bahir Dar", "Mekelle"];

export const departmentOptions = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Orthopedics",
  "Gynecology",
  "Dermatology",
];

export type SearchFilters = { city: string; department: string; name: string };

export function validateSearch(f: SearchFilters): { ok: true; summary: string } | { ok: false; error: string } {
  if (!f.city && !f.department && !f.name.trim()) {
    return { ok: false, error: "Please choose a city or region, a department, or enter a hospital name." };
  }
  const parts = [f.city, f.department, f.name.trim() && `"${f.name.trim()}"`].filter(Boolean);
  return { ok: true, summary: parts.join(" · ") };
}
