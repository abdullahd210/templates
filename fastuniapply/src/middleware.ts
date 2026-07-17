import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

// Auth session presence + coarse role gating for protected route groups
// (dashboard/admin/consultant/admissions/partner/agent) is layered on top of
// this locale middleware in Phase 4 once Auth.js is wired in — see
// docs/05-technical-architecture.md §4.
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Skip API routes, Next internals, and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
