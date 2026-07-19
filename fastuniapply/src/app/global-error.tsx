"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself (where
 * app/[locale]/error.tsx can't help because the locale provider never
 * mounted). Must render its own <html>/<body> — this replaces the whole tree.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B2A5B" }}>FastUniApply is temporarily unavailable</h1>
          <p style={{ color: "#6b7280", maxWidth: 420 }}>
            A critical error occurred. Please try again shortly.
          </p>
          <button
            onClick={reset}
            style={{ background: "#0B2A5B", color: "white", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
