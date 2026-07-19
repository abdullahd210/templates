import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start justify-between gap-4 md:flex-row md:items-end", className)}>
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {viewAllHref && viewAllLabel && (
        <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-primary hover:underline">
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
