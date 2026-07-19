import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgramCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-auto h-10 w-full" />
      </CardContent>
    </Card>
  );
}
