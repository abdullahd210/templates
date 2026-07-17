# Technical Architecture

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/RSC for SEO-critical public pages, PWA-ready |
| Language | TypeScript (strict) | No `any`; `unknown` + narrowing at boundaries |
| UI | React 18, Tailwind CSS, shadcn/ui (Radix primitives) | Accessible by default |
| Forms | React Hook Form + Zod resolvers | Shared Zod schemas used client **and** server |
| Data access | Prisma ORM → PostgreSQL | Single source of schema truth |
| Auth | Auth.js (NextAuth v5), credentials + email verification | JWT session w/ role claims, DB session store |
| Server logic | Next.js Server Actions for mutations used only by the web app; REST route handlers under `/api/*` for anything a future mobile client or partner integration needs | See §3 |
| Validation | Zod, shared `packages/shared` schemas | |
| File storage | S3-compatible object storage (AWS S3 / Cloudflare R2), private buckets, signed URLs | Never public for student documents |
| Email | Provider-agnostic `EmailProvider` interface; Resend/SendGrid adapter | Templates in 3 languages, see `20-email-templates` (Phase implementation) |
| Background jobs | Lightweight queue (e.g., DB-backed job table processed by a cron/worker) for deadline reminders, notification fan-out | Keeps infra minimal; swappable for BullMQ/Redis later |
| Testing | Vitest (unit/integration), Playwright (e2e critical flows) | |
| i18n | `next-intl` | Locale-aware routing, RTL, ICU message format |

## 2. Modularity for a Future Mobile App

- All data mutations that matter to a mobile client are exposed as versioned REST
  endpoints (`/api/v1/...`) with Zod-validated request/response contracts, backed by a
  shared **service layer** (`src/server/services/*`) — Server Actions call the *same*
  service functions as the REST handlers, so business logic is never duplicated between
  the two transport mechanisms.
- Auth uses bearer JWT for `/api/v1/*` (in addition to the cookie session used by the
  web app), so a React Native/Flutter client authenticates the same way.
- Response shapes are stable DTOs (`src/server/dto/*`), decoupled from Prisma models, so
  internal schema changes don't break API consumers.

## 3. Request Flow

```
Browser ──(RSC fetch / Server Action)──▶ Next.js App Router
                                            │
                                   src/server/services/*  ── business logic, permission
                                            │                 checks, validation
                                   src/server/repositories/* ── Prisma queries
                                            │
                                        PostgreSQL

Mobile / partner integration ──(HTTPS + Bearer JWT)──▶ /api/v1/* route handlers
                                            │
                                   (same) src/server/services/*
```

## 4. Multi-Role Access Model

- One `User` table for everyone (student, staff, partner rep, agent). Role is
  determined by `UserRole` rows, not a single enum column, so a user can hold multiple
  roles.
- Route groups map to areas: `(public)`, `(auth)`, `dashboard` (student),
  `admin`, `consultant`, `admissions`, `partner`, `agent`.
- `src/middleware.ts` handles: locale negotiation/rewrite, session presence check for
  protected route groups, and a coarse role gate (redirect if the user holds none of the
  roles allowed for that route group).
- **Server-side, per-record** authorization is enforced again inside each service
  function (e.g., a Partner Rep's `getApplication(id)` call checks
  `application.program.university.id === session.partnerUniversityId`), because the
  middleware role gate alone is not sufficient for row-level ownership (see spec §15).

## 5. Localization

- Locales: `en` (default, LTR), `tr` (LTR), `ar` (RTL).
- Route structure: `app/[locale]/...`; `<html lang dir>` set from locale in root layout.
- UI strings: `next-intl` message catalogs at `src/i18n/messages/{en,tr,ar}.json`.
- **Content translation** (universities, programs, scholarships, articles): modeled as
  a `Translation`/localized-field pattern in Prisma — see `06-database-erd.md` §Localized
  Content — rather than duplicating whole tables per language, so adding a language later
  doesn't require a schema migration.
- Currency: prices stored as integer minor units + ISO currency code; formatted with
  `Intl.NumberFormat(locale, { style: 'currency', currency })`.
- Dates: stored UTC; formatted with `Intl.DateTimeFormat(locale)`; Arabic uses Gregorian
  calendar (not Hijri) per standard international-admissions convention, configurable.

## 6. Security

- Auth.js sessions, httpOnly/secure cookies, short-lived JWT + rotation.
- Server-side Zod validation on every mutation (defense in depth beyond client RHF checks).
- CSRF: Auth.js built-in CSRF token for credential flows; Server Actions get Next.js's
  built-in origin-check CSRF protection.
- Rate limiting on auth + lead/consultation endpoints (sliding-window, keyed by IP+route).
- File uploads: allow-list MIME types + extension, max size per document type, virus-scan
  hook (interface only in v1), stored under a non-guessable key, served only via
  short-TTL signed URLs after an authorization check.
- All list/detail queries scoped by role + ownership at the repository layer, never by
  UI hiding alone.
- Passwords: Argon2id hashing.
- Audit log (`AuditLog`) written for status changes, document actions, payment changes,
  role/permission changes, staff actions, content changes.
- Secrets only via environment variables (`10-environment-variables.md`), never
  committed; `.env.example` documents required keys with no real values.

## 7. SEO

- `generateMetadata` per route (title, description, canonical, OG, Twitter card).
- `app/sitemap.ts` + `app/robots.ts` (dynamic, DB-driven for universities/programs/
  scholarships/articles).
- JSON-LD: `Organization`, `CollegeOrUniversity`, `Course` (programs), `Article`,
  `FAQPage`, `BreadcrumbList`.
- ISR (`revalidate`) for catalog/content pages; on-demand revalidation on admin publish.

## 8. PWA

- `manifest.webmanifest`, service worker for offline shell + asset caching
  (`next-pwa`/Workbox), installable on mobile, but all data remains network-first
  (no offline write queue in v1 — documented as a mobile-app-era enhancement).
