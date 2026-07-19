import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/** Generic hero + two-column skeleton shared by university/program/scholarship detail loading.tsx files. */
export function DetailPageSkeleton() {
  return (
    <div>
      <div className="bg-brand-gradient py-14">
        <div className="container space-y-4">
          <Skeleton className="h-4 w-32 bg-white/20" />
          <Skeleton className="h-8 w-2/3 bg-white/25" />
          <Skeleton className="h-4 w-1/3 bg-white/20" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-32 bg-white/25" />
            <Skeleton className="h-11 w-40 bg-white/25" />
          </div>
        </div>
      </div>
      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <aside>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
