import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
  className,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav className={cn("mt-10 flex items-center justify-center gap-2", className)} aria-label="Pagination">
      <PageLink href={buildHref(Math.max(1, page - 1))} disabled={isFirst}>
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </PageLink>
      <span className="px-3 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <PageLink href={buildHref(Math.min(totalPages, page + 1))} disabled={isLast}>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  const className = cn(buttonVariants({ variant: "outline", size: "icon" }), disabled && "pointer-events-none opacity-50");
  if (disabled) {
    return (
      <span className={className} aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
