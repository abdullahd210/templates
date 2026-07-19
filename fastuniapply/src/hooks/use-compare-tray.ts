"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_COMPARISON_ITEMS } from "@/validation/comparison.schema";

/**
 * Client-side "compare tray": lets anyone (no login required) build up to
 * MAX_COMPARISON_ITEMS selections while browsing a directory, persisted in
 * localStorage so it survives navigation between listing/detail pages. The
 * comparison page itself reads the resulting slugs from the URL (see
 * buildCompareHref), so the selection is also shareable once the user
 * clicks through — localStorage is just the *building* mechanism.
 *
 * This intentionally does not require authentication: forcing a login to
 * try comparing two programs is unnecessary friction on a public directory.
 * Authenticated, cross-device persistence is offered separately via
 * src/server/actions/comparison.ts for signed-in users who want it.
 */
export function useCompareTray(kind: "universities" | "programs") {
  const storageKey = `fastuniapply:compare:${kind}`;
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const readFromStorage = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setSlugs(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setSlugs([]);
    }
  }, [storageKey]);

  useEffect(() => {
    readFromStorage();
    setHydrated(true);
    // Same-tab instances don't receive native `storage` events (those only
    // fire cross-tab), so every toggle() manually dispatches one and every
    // instance listens here to stay in sync within the current tab too.
    window.addEventListener("storage", readFromStorage);
    return () => window.removeEventListener("storage", readFromStorage);
  }, [readFromStorage]);

  const persist = useCallback(
    (next: string[]) => {
      setSlugs(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        window.dispatchEvent(new StorageEvent("storage", { key: storageKey }));
      } catch {
        // localStorage unavailable (private browsing, etc.) — selection just won't persist.
      }
    },
    [storageKey],
  );

  const toggle = useCallback(
    (slug: string): { added: boolean; limitReached: boolean } => {
      if (slugs.includes(slug)) {
        persist(slugs.filter((s) => s !== slug));
        return { added: false, limitReached: false };
      }
      if (slugs.length >= MAX_COMPARISON_ITEMS) {
        return { added: false, limitReached: true };
      }
      persist([...slugs, slug]);
      return { added: true, limitReached: false };
    },
    [slugs, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);
  const isSelected = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, hydrated, toggle, clear, isSelected, max: MAX_COMPARISON_ITEMS };
}
