import { Skeleton } from "@/components/ui/skeleton";
import { UniversityCardSkeleton } from "./university-card-skeleton";
import { ProgramCardSkeleton } from "./program-card-skeleton";
import { ScholarshipCardSkeleton } from "./scholarship-card-skeleton";

const cardByKind = {
  universities: UniversityCardSkeleton,
  programs: ProgramCardSkeleton,
  scholarships: ScholarshipCardSkeleton,
};

/** Full listing-page skeleton: header, filter sidebar, and a matching card grid — used by every directory's loading.tsx. */
export function CatalogGridSkeleton({ kind, count = 9 }: { kind: keyof typeof cardByKind; count?: number }) {
  const CardSkeleton = cardByKind[kind];
  return (
    <div className="container py-12">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </aside>
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
