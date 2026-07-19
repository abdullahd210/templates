import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UniversityCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 p-5">
        <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-auto h-10 w-full" />
      </CardContent>
    </Card>
  );
}
