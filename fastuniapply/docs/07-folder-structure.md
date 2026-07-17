# Project Folder Structure

```
fastuniapply/
├── docs/                            Phase 1 architecture docs (this set)
├── prisma/
│   ├── schema.prisma                 Full entity model (source of truth)
│   ├── migrations/
│   └── seed/
│       ├── index.ts                  Seed entrypoint
│       ├── geography.seed.ts
│       ├── universities.seed.ts
│       ├── programs.seed.ts
│       ├── scholarships.seed.ts
│       ├── articles.seed.ts
│       ├── staff-and-roles.seed.ts
│       └── leads-and-students.seed.ts
├── public/
│   ├── images/
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx                      Homepage
│   │   │   │   ├── about/
│   │   │   │   ├── universities/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [universitySlug]/page.tsx
│   │   │   │   ├── programs/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── compare/page.tsx
│   │   │   │   │   └── [programSlug]/page.tsx
│   │   │   │   ├── scholarships/
│   │   │   │   ├── study-in/[countrySlug]/
│   │   │   │   ├── articles/
│   │   │   │   ├── consultation/
│   │   │   │   ├── contact/
│   │   │   │   ├── faq/
│   │   │   │   ├── success-stories/
│   │   │   │   ├── partnerships/
│   │   │   │   ├── careers/
│   │   │   │   ├── events/
│   │   │   │   └── legal/[doc]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── reset-password/[token]/
│   │   │   │   └── verify-email/[token]/
│   │   │   ├── apply/[applicationId]/step/[step]/
│   │   │   ├── dashboard/                        Student portal (layout enforces role=student)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   ├── applications/
│   │   │   │   ├── documents/
│   │   │   │   ├── offers/
│   │   │   │   ├── payments/
│   │   │   │   ├── messages/
│   │   │   │   ├── support/
│   │   │   │   ├── appointments/
│   │   │   │   ├── favorites/
│   │   │   │   └── notifications/
│   │   │   ├── admin/                            layout enforces staff roles + module perms
│   │   │   ├── consultant/
│   │   │   ├── admissions/
│   │   │   ├── partner/                          layout enforces role=partner_rep
│   │   │   └── agent/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── universities/route.ts
│   │   │   │   ├── programs/route.ts
│   │   │   │   ├── applications/route.ts
│   │   │   │   ├── documents/route.ts
│   │   │   │   └── ...
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── webhooks/
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx                            Root layout (theme, fonts)
│   ├── components/
│   │   ├── ui/                                   shadcn/ui primitives (button, card, input...)
│   │   ├── layout/                                Header, Footer, MobileNav, DashboardShell
│   │   ├── marketing/                             Hero, StatsBar, TestimonialCard, CTASection
│   │   ├── catalog/                                UniversityCard, ProgramCard, ScholarshipCard, Filters
│   │   ├── application/                            WizardStepper, DocumentUploader
│   │   ├── dashboard/                              shared dashboard widgets (student/admin/etc.)
│   │   └── forms/                                  LeadForm, ConsultationForm, ...
│   ├── server/
│   │   ├── actions/                               Server Actions (thin wrappers over services)
│   │   ├── services/                               Business logic (auth, applications, leads, ...)
│   │   ├── repositories/                           Prisma query layer, one per aggregate
│   │   ├── dto/                                    API response shapes
│   │   ├── auth/                                   Auth.js config, session helpers, RBAC guards
│   │   ├── storage/                                File storage adapter (S3/R2) + signed URLs
│   │   ├── email/                                  EmailProvider interface + adapter + templates
│   │   └── jobs/                                   Scheduled/queued tasks (reminders, digests)
│   ├── lib/
│   │   ├── db.ts                                   Prisma client singleton
│   │   ├── utils.ts
│   │   ├── format.ts                               currency/date formatting helpers
│   │   └── constants.ts
│   ├── i18n/
│   │   ├── config.ts                               locales, default locale, RTL list
│   │   ├── messages/{en,ar,tr}.json
│   │   └── request.ts                              next-intl request config
│   ├── validation/                                 Zod schemas shared client+server
│   │   ├── application.schema.ts
│   │   ├── lead.schema.ts
│   │   ├── document.schema.ts
│   │   └── ...
│   ├── types/                                      Shared TS types not derived from Prisma
│   ├── middleware.ts                               locale + auth + coarse role gate
│   └── styles/globals.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Design rationale

- **`server/services` is the single business-logic layer.** Server Actions
  (`server/actions`) and REST route handlers (`app/api/v1/*`) are both thin adapters
  over the same services — this is what makes a future mobile client possible without
  duplicating logic (see `05-technical-architecture.md` §2).
- **`server/repositories`** isolate Prisma; services never import `@prisma/client`
  directly, which keeps row-level authorization and soft-delete filtering in one place
  per aggregate.
- **Route groups `(public)` / `(auth)`** don't affect the URL, they only let each area
  have its own layout (marketing chrome vs. auth-card chrome) while `dashboard`,
  `admin`, `consultant`, `admissions`, `partner`, `agent` are real path segments with
  their own protected layouts.
- **`validation/`** is imported by both a `<Form>` client component (via
  `zodResolver`) and the corresponding server action/route handler — one schema, two
  enforcement points.
