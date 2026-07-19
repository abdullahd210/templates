import Link from "next/link";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FilterChip {
  key: string;
  label: string;
  /** href with this filter removed (all other active filters preserved). */
  removeHref: string;
}

/** Shows active filters as removable chips, so a filtered URL is self-explanatory and editable in place. */
export function FilterChips({ chips, clearAllHref }: { chips: FilterChip[]; clearAllHref: string }) {
  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link key={chip.key} href={chip.removeHref}>
          <Badge variant="secondary" className="gap-1 pe-1.5 hover:opacity-90">
            {chip.label}
            <X className="h-3 w-3" />
          </Badge>
        </Link>
      ))}
      <Link href={clearAllHref} className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline">
        Clear all
      </Link>
    </div>
  );
}
