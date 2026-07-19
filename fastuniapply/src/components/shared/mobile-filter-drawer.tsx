"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Wraps a filter form (passed as children — the same server-rendered GET
 * form used in the desktop sidebar) in a dialog for small screens, so there
 * is exactly one filter form per page, not two divergent copies.
 */
export function MobileFilterDrawer({
  children,
  activeCount = 0,
}: {
  children: React.ReactNode;
  activeCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" className="md:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="ms-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
            {activeCount}
          </span>
        )}
      </Button>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div onClick={() => setOpen(false)} className="contents">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
