import { SearchX, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function DirectoryEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-primary">
        <SearchX className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-bold text-navy">No hospitals found</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We couldn't find any demonstration hospitals matching your search. Try adjusting your filters.
      </p>
      <Button className="mt-6" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function DirectoryLoadingState() {
  return (
    <div role="status" aria-label="Loading hospitals" className="flex flex-col gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:p-5">
          <Skeleton className="h-40 w-full rounded-xl sm:h-28 sm:w-44" />
          <div className="flex-1 space-y-3 py-1">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading hospitals…</span>
    </div>
  );
}

export function DirectoryErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-bold text-navy">Unable to load hospitals</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Something went wrong while showing the demonstration directory. Please try again.
      </p>
      <Button variant="outline" className="mt-6 border-primary text-primary hover:bg-accent hover:text-primary" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
