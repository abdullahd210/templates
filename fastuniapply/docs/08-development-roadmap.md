# Development Roadmap

Matches the phased workflow requested for this project. Each phase produces working,
committed increments — never one unstructured dump.

## Phase 1 — Architecture (this delivery)
- Product requirements, roles/permissions, user journeys, sitemap, features list.
- Technical architecture, database ERD + Prisma schema, folder structure.
- Env vars, deployment strategy.
- Project scaffold: tooling config, Prisma schema, i18n structure, design tokens,
  base layout — buildable skeleton, no business pages yet.

## Phase 2 — Design System
- Tailwind theme tokens (color, type scale, spacing, radii, shadow) from brand spec.
- Base shadcn/ui components themed (button variants incl. orange "conversion" variant,
  card, input, select, tabs, dialog, sheet, toast, table, badge/status-pill).
- Layout primitives: `Header`, `Footer`, `MobileNav`, `DashboardShell`,
  `Breadcrumbs`, `EmptyState`, `ErrorState`, `SkeletonCard`.
- Form patterns: `FormField` wrapper wired to RHF + Zod, validation message style.

## Phase 3 — Public Website
- Homepage, University directory + detail, Program directory + detail + comparison,
  Scholarship directory + detail, Study destinations (11 countries), Articles,
  Consultation form, Contact, FAQ, legal pages, global search, language switcher.
- SEO: metadata, sitemap.xml, robots.txt, JSON-LD.
- Demo data seeded (10+ universities, 30+ programs, 10+ scholarships, 10+ articles).

## Phase 4 — Authentication & Student Experience
- Auth.js: register/login/logout, email verification, password reset.
- Student dashboard: overview, profile, applications (list/detail/timeline), documents
  center, favorites, notifications.
- 14-step guided application wizard with save & resume.
- Messaging/support/appointments (functional baseline).

## Phase 5 — Admin, CRM & Operations
- Admin overview/KPIs, Lead CRM (pipeline, assignment, conversion), Student management,
  Application management (status engine, notes, deadlines), University/Program/
  Scholarship CRUD, CMS (articles/FAQ/testimonials/success stories/banners/SEO),
  Staff & role management, Finance module, Reports & CSV export, Activity log.
- Consultant dashboard, Admissions Officer dashboard (built on the same services as Admin).

## Phase 6 — Partner & Agent Portals, Hardening
- Partner University portal (scoped to own university).
- Educational Agent portal (leads, applications, commissions).
- Security review (see `05-technical-architecture.md` §6), performance pass
  (ISR/caching, image optimization, bundle size), accessibility audit.
- Test coverage for critical flows (auth, application status transitions, document
  upload/verification, lead conversion).
- Deployment (see `09-deployment-strategy.md`).

## Working agreement for this delivery

Given the size of the full system, this session executes **Phase 1 completely** (docs +
scaffold) and begins **Phase 2/3** with a working vertical slice rather than stubs:
design tokens + layout shell, then the homepage and university/program directories
wired to the real Prisma schema and seed data. Subsequent sessions continue module by
module down this roadmap — the schema and folder structure are built to accommodate all
later phases without rework.
