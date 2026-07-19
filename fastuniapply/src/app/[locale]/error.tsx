"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary for everything under app/[locale]/. Next.js
 * mounts this in place of the segment that threw. Kept locale-neutral
 * (no next-intl hook) since the error may originate from the locale
 * provider itself.
 */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertOctagon className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl font-bold text-primary">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. You can try again, or return home.
      </p>
      <div className="mt-2 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
      {error.digest && <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </div>
  );
}
