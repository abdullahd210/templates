# FastUniApply

International education consultancy platform — university/program/scholarship
discovery, guided applications, document management, and a student CRM /
admissions operations system, multilingual (English, Arabic, Turkish).

Architecture, sitemap, roles/permissions, ERD, and roadmap live in [`docs/`](./docs).
This README covers running what's implemented so far.

## Status: Phase 1 — Infrastructure

Phase 1 is complete: project setup, folder structure, global layout, design
system, database schema, authentication + RBAC foundation, localization with
RTL, error/loading/empty states, and a minimal working shell — not the public
marketing site, catalog, or dashboards. Those are Phase 2+ (see
`docs/08-development-roadmap.md`). See `docs/04-features-list.md` for the
full ✅/🧱/🗺️ breakdown.

Implemented in this phase:
- Next.js App Router + TypeScript project, clean layered folder structure
  (`app/`, `components/`, `server/{auth,actions,...}`, `lib/`, `validation/`)
- Design system: Tailwind tokens for the brand palette/type scale, 16
  reusable shadcn/ui-style components (Button, Card, Input, Select, Dialog,
  Tabs, Toast, Checkbox, Avatar, Alert, Skeleton, etc.)
- Full Prisma schema modeling every module of the product (60+ entities),
  migrated and seeded against a real PostgreSQL database
- Auth.js (NextAuth v5) authentication: Credentials provider + Prisma
  adapter, JWT sessions, working register/login pages and server action
- Role & permission architecture: a single `rbac-constants.ts` source of
  truth for 14 roles / 22 permissions, consumed by both the seed script and
  runtime `hasRole`/`hasPermission`/`requirePermission` server helpers
- Localization: next-intl for English/Arabic/Turkish with full RTL mirroring,
  wired into every page built so far (shell, header, footer, auth screens)
- Error handling: typed `AppError` hierarchy, route-level `error.tsx` /
  `not-found.tsx` / `global-error.tsx` boundaries, reusable `EmptyState` /
  `ErrorState` components, and `loading.tsx` skeletons
- SEO scaffolding (`sitemap.ts`, `robots.ts`, per-locale metadata)
- Seed data: 12 universities, 32 programs, 11 scholarships, 11 countries, 12
  articles, demo staff/students/leads/applications across multiple statuses

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
| `npm run db:seed` | Load demo data (refuses to run if `NODE_ENV=production`) |
| `npm run db:studio` | Prisma Studio |

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
