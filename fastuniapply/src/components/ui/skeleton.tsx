import { cn } from "@/lib/utils";

/** Base loading-state primitive — compose into skeleton layouts per route (see loading.tsx files). */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
