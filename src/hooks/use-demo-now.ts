import { useEffect, useState } from "react";

/**
 * Current time, captured once after hydration. Returns null during SSR and the
 * first client render so date-relative demo data never mismatches the server.
 */
export function useDemoNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}
