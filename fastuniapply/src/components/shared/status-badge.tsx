import { Badge } from "@/components/ui/badge";
import type { AdmissionStatus } from "@prisma/client";

const admissionStatusConfig: Record<AdmissionStatus, { label: string; variant: "success" | "muted" | "outline" }> = {
  OPEN: { label: "Admissions Open", variant: "success" },
  UPCOMING: { label: "Upcoming", variant: "outline" },
  CLOSED: { label: "Closed", variant: "muted" },
};

/** Standardized status pill for admission status — used on cards, detail pages, and the comparison table. */
export function AdmissionStatusBadge({ status, className }: { status: AdmissionStatus; className?: string }) {
  const config = admissionStatusConfig[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="accent" className={className}>
      Featured
    </Badge>
  );
}
