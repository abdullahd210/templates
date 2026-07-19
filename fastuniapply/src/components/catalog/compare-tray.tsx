"use client";

import Link from "next/link";
import { X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareTray } from "@/hooks/use-compare-tray";

/**
 * Floating bar shown whenever the user has 1+ items selected for comparison
 * on either the universities or programs directory. Mounted once in the
 * public layout so the selection (and this bar) persists across navigation.
 */
export function CompareTray({ locale }: { locale: string }) {
  const universities = useCompareTray("universities");
  const programs = useCompareTray("programs");

  const active = universities.slugs.length > 0 ? universities : programs.slugs.length > 0 ? programs : null;
  const kind = universities.slugs.length > 0 ? "universities" : "programs";

  if (!active || active.slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-elevated backdrop-blur">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Scale className="h-4 w-4 text-secondary" />
          <span className="font-medium">
            {active.slugs.length} of {active.max} {kind} selected for comparison
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={active.clear}>
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href={`/${locale}/${kind}/compare?${kind === "universities" ? "universities" : "programs"}=${active.slugs.join(",")}`}>
              Compare {active.slugs.length}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
