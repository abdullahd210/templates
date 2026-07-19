# FastUniApply

International education consultancy platform — university/program/scholarship
discovery, guided applications, document management, and a student CRM /
admissions operations system, multilingual (English, Arabic, Turkish).

Architecture, sitemap, roles/permissions, ERD, and roadmap live in [`docs/`](./docs).
This README covers running what's implemented so far.

## Status

**Phase 1 (Infrastructure)**, **Phase 2 (Public website & homepage)**, and
now the **Universities / Academic Programs / Scholarships modules** are
complete. Student dashboards, application tracking, document management, and
the admin CRM UI are still Phase 4+ (see `docs/08-development-roadmap.md`) —
only their backend foundation (schemas/services/permissions) exists so far.
See `docs/04-features-list.md` for the full ✅/🧱/🗺️ breakdown.

Phase 1 — Infrastructure:
- Next.js App Router + TypeScript project, clean layered folder structure
  (`app/`, `components/`, `server/{auth,actions,...}`, `lib/`, `validation/`)
- Design system: Tailwind tokens for the brand palette/type scale, reusable
  shadcn/ui-style components (Button, Card, Input, Select, Dialog, Tabs,
  Toast, Checkbox, Avatar, Alert, Skeleton, etc.)
- Full Prisma schema modeling every module of the product, migrated and
  seeded against a real PostgreSQL database
- Auth.js (NextAuth v5) authentication: Credentials provider + Prisma
  adapter, JWT sessions, working register/login pages and server action
- Role & permission architecture: a single `rbac-constants.ts` source of
  truth for 14 roles / 22 permissions, consumed by both the seed script and
  runtime `hasRole`/`hasPermission`/`requirePermission` server helpers
- Localization: next-intl for English/Arabic/Turkish with full RTL mirroring
- Error handling: typed `AppError` hierarchy, route-level `error.tsx` /
  `not-found.tsx` / `global-error.tsx` boundaries, reusable `EmptyState` /
  `ErrorState` components, and `loading.tsx` skeletons
- SEO scaffolding (`sitemap.ts`, `robots.ts`, per-locale metadata)

### Universities, Academic Programs & Scholarships modules

Full database-backed directory + detail pages for all three catalog types,
built on the Phase 1 architecture (repository → service → server
action/page layers, Zod-validated everything):

- **Listing pages** (`/[locale]/universities`, `/programs`, `/scholarships`):
  server-side search, filters (country, city, type, degree level, study
  language, tuition range, scholarships, admission status, featured, and
  module-specific filters like duration/nationality/coverage type), 7 sort
  modes (relevance, name, tuition asc/desc, newest, deadline, featured
  first), pagination, active-filter chips, a desktop sidebar + mobile
  drawer sharing one filter form component, result counts, and empty states.
  Every filter is parsed through a Zod schema (`src/validation/*-query.schema.ts`)
  that **silently drops invalid/tampered values instead of throwing** — a
  malformed URL degrades to "no filter," it never 500s the page.
- **Detail pages**: cover image, logo, rankings, accreditations, image
  gallery, campuses, degree levels, tuition/scholarships, admission
  requirements, intake windows, FAQs, related articles, breadcrumbs +
  `BreadcrumbList` JSON-LD, and Apply/Consultation CTAs.
- **Favorites**: authenticated students can save any university/program/
  scholarship (`Favorite` model, unique per user+type+entity — duplicates
  are impossible). Unauthenticated clicks redirect to `/login` with a
  callback URL.
- **Comparison**: up to 4 universities or 4 programs. Selection works for
  everyone via a `localStorage`-backed "compare tray" (no login required to
  build a comparison); `/universities/compare` and `/programs/compare` render
  a table on desktop and a stacked card-per-item view on mobile. A separate
  DB-backed `ComparisonList`/`ComparisonItem` layer exists for authenticated
  cross-device persistence (`saveComparisonAction`).
- **Admin foundation** (no UI yet, by design): Zod create/update schemas +
  permission-gated service functions for University/Program/Scholarship/
  Country/City/AcademicField/Major/Fee/Intake/Requirement/Translation under
  `src/validation/admin/` and `src/server/services/admin/` — ready for the
  future admin dashboard to call.

New Prisma models: `UniversityRanking`, `UniversityAccreditation`,
`UniversityGallery`, `UniversityIntake`, `AcademicField`, `Major`,
`ScholarshipEligibility`, `ScholarshipUniversity`, `ScholarshipProgram`,
plus a redesigned `Favorite`/`ComparisonList`/`ComparisonItem`. The
`DegreeLevel` enum now also includes `ASSOCIATE` and `CERTIFICATE`.

Seed data: 14 universities, 41 programs, 11 scholarships, 11 countries
(covering Türkiye, Hungary, Germany, Poland, Italy, Malaysia, Cyprus, UK,
Canada, US, and UAE), rankings/accreditations/gallery images/intakes for a
representative subset, scholarship↔program and scholarship↔university links,
auto-derived structured eligibility criteria, and Arabic/Turkish sample
translations for one university/program/scholarship (demonstrating the
locale-fallback path — everything else falls back to English). All of it is
`isDemo: true` and clearly documented as non-verified sample data — see
[Demo Data Disclosure](#demo-data-disclosure) below. The seed script is
idempotent (safe to re-run).

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL 14+ database (a `docker-compose.yml` is included for a local one)

### Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, etc.

# Local database option (skip if you already have a PostgreSQL instance):
docker compose up -d

npx prisma migrate dev       # creates the schema
npm run db:seed              # loads demo data
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/en` (or `/ar` / `/tr`).
Try `/en/register` and `/en/login` to exercise the auth flow end-to-end.

Demo accounts (after seeding, password `ChangeMe123!` for all):
`admin@fastuniapply.demo`, `consultant@fastuniapply.demo`,
`officer@fastuniapply.demo`, and three `*.student@fastuniapply.demo`
accounts. Only the student accounts can sign in through `/login` today —
staff/admin dashboards (and their own login-gated routes) are Phase 5.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run test` | Unit/integration tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:seed` | Load demo data (refuses to run if `NODE_ENV=production`; idempotent — safe to re-run) |
| `npm run db:studio` | Prisma Studio |

In a non-interactive environment (CI, this sandbox), `prisma migrate dev`
fails with "environment is non-interactive." Use instead:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script \
  > prisma/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name/migration.sql
npx prisma migrate deploy
npx prisma generate
```

### Testing

`npm run test` runs Vitest (`vitest.config.ts` + `vitest.setup.ts`, which
loads `.env` via Node's built-in `process.loadEnvFile`). Most tests under
`src/server/**` and `prisma/seed/**` exercise the real repository/service
layer against a seeded PostgreSQL database — run `npm run db:seed` first.
Pure-validation tests (`src/validation/**`) have no DB dependency.

## Package version choices

This project intentionally pins to the newest version within a **major line
that's fully verified working end-to-end** (`npm install` → `prisma
generate` → `tsc --noEmit` → `eslint` → `next build` → real Postgres
migrate/seed → live register/login through a browser), rather than the
absolute newest major of every package:

- **Next.js 14.2.x** (not 15/16) — the App Router patterns this codebase
  uses (sync `params`, `generateMetadata`, `next-intl` middleware) are the
  well-documented Next 14 shape. Next 15 changed `params`/`searchParams` to
  Promises; adopting that (or the newer Next 16) is a deliberate follow-up,
  not a blind bump.
- **Tailwind CSS 3.4.x** (not 4) — v4 replaces `tailwind.config.ts` with a
  CSS-native `@theme` config model. Re-platforming the whole token system on
  an unverified major during the infrastructure phase was judged higher-risk
  than the currency gain; the v3 config here is the latest 3.x.
- **TypeScript 5.9.x** (not the newer native-compiler major) — kept on the
  broadly-supported 5.x line for maximum tool compatibility (ESLint plugins,
  `tsx`, editor integration).
- **Prisma 6.19.x**, **next-auth 5.0.0-beta.31** ("Auth.js"), **next-intl
  3.26.x**, **react-hook-form 7.82.x** — bumped to latest and verified
  against this schema/config; no known compatibility risk.

All of the above were empirically re-verified after bumping (clean
typecheck, lint, build, and a real Postgres migration/seed/auth-flow run) —
see the commit history for this phase.

## Documentation

1. [Product Requirements](./docs/01-product-requirements.md)
2. [Roles & Permissions](./docs/02-roles-and-permissions.md)
3. [Sitemap](./docs/03-sitemap.md)
4. [Features List](./docs/04-features-list.md)
5. [Technical Architecture](./docs/05-technical-architecture.md)
6. [Database ERD](./docs/06-database-erd.md)
7. [Folder Structure](./docs/07-folder-structure.md)
8. [Development Roadmap](./docs/08-development-roadmap.md)
9. [Environment Variables](./docs/09-environment-variables.md)
10. [Deployment Strategy](./docs/10-deployment-strategy.md)

## Demo Data Disclosure

All universities, programs, scholarships, staff, and student accounts seeded
by `npm run db:seed` are fictional placeholder content for development and
QA (`isDemo: true` on catalog records). Replace via the Admin dashboard
before any production launch.
