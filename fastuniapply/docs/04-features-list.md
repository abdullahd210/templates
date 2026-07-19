# Feature Inventory

Legend: ✅ built and verified · 🧱 data model/API surface ready, UI not yet built ·
🗺️ planned, documented only

This reflects **actual implementation state**, checked against the codebase — not an
aspirational target. See `08-development-roadmap.md` for which phase builds each 🗺️/🧱 item.

## Public Website (Phase 3)
- ✅ Minimal infrastructure shell page (proves layout/i18n/auth render correctly)
- 🗺️ Homepage (hero, search, CTAs, stats, featured universities/programs/scholarships,
  how-it-works, testimonials, partner logos, articles, FAQ, lead form, newsletter, WA button)
- 🗺️ University directory + filters + cards, University details page
- 🗺️ Program directory + filters + details page, Program comparison
- 🗺️ Scholarship directory + details
- 🗺️ Study destination pages (11 countries)
- 🗺️ Articles index + details
- 🗺️ Free consultation form, Contact page, FAQ page, legal pages, global search
- ✅ Language selector (en/ar/tr) with full RTL for Arabic — implemented and verified
  on every page built so far (shell, header, footer, login, register)

## Auth (Phase 1 — this delivery)
- ✅ Registration, login (Auth.js Credentials provider + Prisma adapter, JWT sessions)
- ✅ Role & permission architecture (`src/lib/rbac-constants.ts`,
  `src/server/auth/rbac.ts`): 14 roles, 22 permissions, `hasRole`/`hasPermission`/
  `requirePermission`/`canAccessOwned` helpers
- 🗺️ Email verification sending, password reset flow, logout UI, staff 2FA (TOTP) —
  schema and error-handling scaffolding are in place; sending/flows are Phase 4

## Student Dashboard (Phase 4)
- 🗺️ Overview, profile, applications, documents center, offers, payments, messages,
  appointments, favorites, notifications — all schema-ready, no UI yet

## Admin Dashboard (Phase 5)
- 🗺️ Overview/KPIs, lead CRM, student/application/university/program/scholarship
  management, CMS, staff & role management, finance, reports, activity log viewer

## Consultant / Admissions Officer Dashboards (Phase 5)
- 🗺️ Not yet built

## Partner University Portal / Educational Agent Portal (Phase 6)
- 🗺️ Not yet built

## Cross-cutting infrastructure (Phase 1 — this delivery)
- ✅ Full relational schema for every module (60+ Prisma models), migrated and seeded
  against a real PostgreSQL database
- ✅ Design system: Tailwind brand tokens + 16 reusable shadcn/ui-style components
- ✅ i18n (en/ar/tr) with RTL, via next-intl, verified end-to-end
- ✅ Error handling: typed `AppError` hierarchy, route-level error/not-found/global-error
  boundaries, reusable `EmptyState`/`ErrorState` components, loading skeletons
- ✅ SEO scaffolding (`sitemap.ts`, `robots.ts`, per-locale metadata)
- 🗺️ Secure file upload, signed URLs, audit logging writes, real-time messaging —
  schema exists (`Document`, `AuditLog`, `Message`), service-layer implementation is
  a later phase

Items marked 🧱/🗺️ have their data model fully designed now (see `06-database-erd.md`)
so no future migration/rework is needed — only UI and business-logic wiring remain.
