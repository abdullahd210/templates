"use client";

import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { cn } from "@/lib/utils";

export function CompareButton({
  kind,
  slug,
  className,
}: {
  kind: "universities" | "programs";
  slug: string;
  className?: string;
}) {
  const { toggle, isSelected, hydrated, max } = useCompareTray(kind);
  const { toast } = useToast();
  const selected = hydrated && isSelected(slug);

  function handleClick() {
    const result = toggle(slug);
    if (result.limitReached) {
      toast({ title: `You can compare up to ${max} items`, description: "Remove one to add another." });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={selected ? "Remove from comparison" : "Add to comparison"}
      className={cn(selected && "border-secondary bg-secondary/10 text-secondary", className)}
    >
      <Scale className="h-4 w-4" />
    </Button>
  );
}
