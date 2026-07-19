# Deployment Strategy

## Recommended topology

| Concern | Recommendation | Why |
|---|---|---|
| App hosting | Vercel (or any Node 20+ host supporting Next.js standalone output) | First-class Next.js SSR/ISR, edge middleware, image optimization |
| Database | Managed PostgreSQL (Neon, Supabase, RDS, or Cloud SQL) | Connection pooling + branching (Neon) useful for preview envs |
| File storage | Cloudflare R2 or AWS S3, private bucket + signed URLs | Never expose student documents publicly |
| Email | Resend or SendGrid | Transactional templates, deliverability, EU/])US region choice |
| Background jobs | Vercel Cron (or a small worker process) hitting `/api/jobs/*` guarded by `CRON_SECRET` | Deadline reminders, notification digests, without extra infra |
| Error/monitoring | Sentry (or equivalent) | Server + client error tracking |
| Analytics | GA4 or Plausible | Marketing conversion tracking |

## Environments

1. **Local** — `docker-compose.yml` (not committed yet, add in Phase 3) for Postgres +
   local S3-compatible storage (MinIO) so file upload works without cloud creds.
2. **Preview** — one per pull request (Vercel preview deployments + a branched/ephemeral
   database), seeded with demo data.
3. **Staging** — mirrors production config, used for stakeholder review before release.
4. **Production** — protected branch deploy, migrations run as a release step (not on
   every boot), manual approval gate for destructive migrations.

## CI/CD pipeline (GitHub Actions, added in Phase 6)

```
on: pull_request → lint (eslint) → typecheck (tsc --noEmit) → unit/integration tests
    (vitest) → prisma migrate diff check → build
on: push to main → same checks → prisma migrate deploy → deploy
on: schedule (nightly) → e2e (playwright) against staging
```

## Migrations

- `prisma migrate dev` locally to generate migrations; `prisma migrate deploy` in CI/CD
  for staging/production — never `prisma db push` against production.
- Additive-first migration discipline: add nullable/defaulted columns, backfill,
  then tighten constraints in a follow-up migration, to avoid downtime.

## Release checklist (Phase 6 deliverable)

- [ ] `.env` values present for the target environment, verified by the Zod env schema
- [ ] Migrations applied
- [ ] Seed data **not** run in production (seed scripts are dev/staging only, guarded by
      `NODE_ENV !== 'production'`)
- [ ] Signed URL TTLs and bucket privacy verified
- [ ] Rate limiting active on public forms (lead/consultation/auth)
- [ ] Sitemap/robots reachable, key pages indexable
- [ ] Error monitoring receiving events
- [ ] Backups configured on the managed Postgres instance
