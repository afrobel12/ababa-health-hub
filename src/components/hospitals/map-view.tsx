import { useEffect, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hospital } from "@/data/hospitals";
import { cn } from "@/lib/utils";
import { DepartmentTags, TypeBadge } from "./hospital-card";

// Schematic (not geographically precise) outline for the demonstration map.
const ETHIOPIA_OUTLINE =
  "M78 38 L168 26 L238 44 L306 84 L344 142 L318 204 L262 252 L186 292 L112 262 L72 200 L52 118 Z";

const CITY_LABELS: { name: string; x: number; y: number }[] = [
  { name: "Mekelle", x: 248, y: 38 },
  { name: "Bahir Dar", x: 118, y: 78 },
  { name: "Addis Ababa", x: 192, y: 154 },
  { name: "Dire Dawa", x: 312, y: 124 },
  { name: "Adama", x: 228, y: 188 },
  { name: "Hawassa", x: 192, y: 238 },
];

/**
 * Frontend-only demonstration map: a labelled schematic surface with one
 * marker per filtered hospital. Positions are synthetic and approximate.
 */
export function HospitalMapView({
  hospitals,
  onViewDetails,
}: {
  hospitals: Hospital[];
  onViewDetails: (h: Hospital) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = hospitals.find((h) => h.id === selectedId) ?? null;

  // Drop the selection when filtering removes the selected hospital.
  useEffect(() => {
    if (selectedId && !hospitals.some((h) => h.id === selectedId)) setSelectedId(null);
  }, [hospitals, selectedId]);

  const markerKeyDown = (e: KeyboardEvent<SVGGElement>, h: Hospital) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedId(h.id);
    }
  };

  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
        Illustrative map — fictional hospital locations.
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-sky">
          <svg viewBox="0 0 400 320" role="img" aria-label="Schematic demonstration map of Ethiopia with fictional hospital markers" className="h-auto w-full">
            <path d={ETHIOPIA_OUTLINE} className="fill-accent stroke-border" strokeWidth={2} strokeLinejoin="round" />
            {CITY_LABELS.map((c) => (
              <text key={c.name} x={c.x} y={c.y} textAnchor="middle" className="fill-muted-foreground" fontSize={10} fontWeight={600}>
                {c.name}
              </text>
            ))}
            {hospitals.map((h) => {
              const isSelected = h.id === selectedId;
              return (
                <g
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Show preview for ${h.name}, ${h.city}`}
                  onClick={() => setSelectedId(h.id)}
                  onKeyDown={(e) => markerKeyDown(e, h)}
                  className="cursor-pointer outline-none"
                >
                  <circle
                    cx={h.map.x}
                    cy={h.map.y}
                    r={isSelected ? 10 : 7}
                    className={cn(
                      "transition-all",
                      isSelected ? "fill-teal stroke-navy" : "fill-primary stroke-background hover:fill-teal",
                      "focus-visible:stroke-navy",
                    )}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {selected ? (
          <aside aria-label="Selected hospital preview" className="flex flex-col gap-2 self-start rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                <h3 className="text-base font-bold text-navy">{selected.name}</h3>
                <TypeBadge type={selected.type} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close hospital preview"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {selected.city}, {selected.region}
            </p>
            <DepartmentTags departments={selected.departments} />
            <Button
              variant="outline"
              className="mt-2 h-10 border-primary text-primary hover:bg-accent hover:text-primary"
              onClick={() => onViewDetails(selected)}
            >
              View Details
            </Button>
          </aside>
        ) : (
          <aside className="hidden self-start rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground lg:block">
            Select a marker to preview a fictional hospital.
          </aside>
        )}
      </div>

      {/* Accessible text alternative to the map markers. */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-navy">Hospitals shown on the map</h3>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2" aria-label="Map results as a list">
          {hospitals.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => setSelectedId(h.id)}
                aria-pressed={h.id === selectedId}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                  h.id === selectedId ? "bg-accent font-semibold text-primary" : "text-foreground",
                )}
              >
                {h.name} <span className="text-muted-foreground">— {h.city}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
