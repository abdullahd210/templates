# Feature Inventory

Legend: ✅ target for MVP slice (built in this initial implementation pass) · 🧱 schema/API
scaffolded, UI stubbed · 🗺️ planned, documented only (built in a later roadmap phase)

## Public Website
- ✅ Homepage (hero, search, CTAs, stats, featured universities/programs/scholarships,
  how-it-works, testimonials, partner logos, articles, FAQ, lead form, newsletter, WA button)
- ✅ University directory + filters + cards
- ✅ University details page
- ✅ Program directory + filters
- ✅ Program details page
- 🧱 Program comparison (up to 4)
- ✅ Scholarship directory + details
- ✅ Study destination pages (11 countries)
- ✅ Articles index + details (categories, TOC, related content, sharing)
- 🧱 Multi-step application wizard (14 steps, save & resume)
- ✅ Free consultation form
- ✅ Contact page
- 🗺️ Success stories, partnerships, become-a-partner/agent, careers, events
- ✅ FAQ page
- ✅ Legal pages (privacy, terms, cookies, refund, service agreement)
- ✅ Global search
- ✅ Language selector (en/ar/tr) with RTL for Arabic

## Auth
- ✅ Registration, login, logout
- ✅ Email verification
- ✅ Password reset
- 🗺️ Staff 2FA (TOTP)

## Student Dashboard
- ✅ Overview
- ✅ Profile
- ✅ Applications list/detail/timeline
- 🧱 Documents Center (upload/preview/download/replace/delete/verification status)
- 🧱 Offers & acceptances
- 🧱 Payments & invoices (proof-of-payment upload; no live PSP in v1)
- 🧱 Messages/support tickets
- 🧱 Appointments
- ✅ Favorites
- ✅ Notifications (in-app; email templates defined, sending stubbed behind an
  `EmailProvider` interface)

## Admin Dashboard
- ✅ Overview/KPIs
- ✅ Lead CRM (list, stages, sources, assignment, conversion to student)
- ✅ Student management
- 🧱 Application management (status changes, notes, deadlines)
- 🧱 University/Program/Scholarship management (CRUD)
- 🧱 Content management (articles/FAQs/testimonials/success stories/banners/SEO)
- 🧱 Staff & role management (RBAC editor)
- 🗺️ Finance module (invoices/payments/commissions/refunds/expenses)
- 🧱 Reports & analytics (core reports; CSV export)
- 🗺️ Activity/audit log viewer UI (writes are implemented from day one; UI is later)

## Consultant / Admissions Officer Dashboards
- 🧱 Consultant: assigned leads/students, notes, recommendations, application creation
- 🧱 Admissions Officer: document verification queue, submission workflow

## Partner University Portal
- 🧱 Own-university applications, decisions, document requests

## Educational Agent Portal
- 🧱 Lead/student submission, application tracking, commission statements

## Cross-cutting
- ✅ Full relational schema for all 12-§ entities (Prisma), even where UI is 🧱/🗺️
- ✅ RBAC middleware + server-side permission checks
- ✅ i18n (en/ar/tr), RTL, locale-aware currency/date formatting
- ✅ SEO (metadata, sitemap.xml, robots.txt, JSON-LD for University/Article/FAQ/Breadcrumb)
- ✅ Secure file upload (type/size validation, private storage, signed URLs)
- ✅ Audit logging (write-side)
- 🗺️ Real-time messaging (v1 is polling/refetch-based via server actions; WebSocket
  upgrade is a documented future extension point)

This phasing matches `09-development-roadmap.md`. Items marked 🧱/🗺️ have their data
model and API surface fully designed now so no future migration/rework is needed —
only UI and business-logic wiring remain.
