# FastUniApply

International education consultancy platform — university/program/scholarship
discovery, guided applications, document management, and a student CRM /
admissions operations system, multilingual (English, Arabic, Turkish).

Architecture, sitemap, roles/permissions, ERD, and roadmap live in [`docs/`](./docs).
This README covers running what's implemented so far.

## Status

This is an early, actively-developed build. See `docs/04-features-list.md` for
what's implemented (✅) vs. scaffolded (🧱) vs. planned (🗺️), and
`docs/08-development-roadmap.md` for the phase plan.

Implemented in this pass:
- Full Prisma schema for the entire product (all modules — not just what has UI yet)
- Design system foundation (Tailwind tokens, shadcn/ui-style primitives)
- i18n scaffolding for en/ar/tr with RTL support
- A real, working homepage (hero, stats, catalog cards, how-it-works, testimonials,
  FAQ, lead capture form) wired to the brand design system
- SEO scaffolding (sitemap.ts, robots.ts, per-locale metadata)
- Seed data: 12 universities, 32 programs, 11 scholarships, 11 countries, 12
  articles, demo staff/students/leads/applications across multiple statuses

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL 14+ database

### Setup

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL, AUTH_SECRET, etc.
npx prisma migrate dev       # creates the schema
npm run db:seed              # loads demo data
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/en` (or `/ar` / `/tr`).

Demo login (after seeding): `admin@fastuniapply.demo` / `ChangeMe123!`
(also `consultant@`, `officer@`, and `*.student@fastuniapply.demo`). Auth
wiring (Phase 4) is not yet implemented, so these accounts exist in the
database but there's no login UI yet.

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
