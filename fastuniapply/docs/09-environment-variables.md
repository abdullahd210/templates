# Environment Variables

See `.env.example` at the project root for the authoritative, committed list (no real
values). Summary by concern:

## App
- `NODE_ENV` — `development` | `production` | `test`
- `NEXT_PUBLIC_APP_URL` — canonical site URL, used for metadata/OG/sitemap
- `NEXT_PUBLIC_DEFAULT_LOCALE` — `en`

## Database
- `DATABASE_URL` — PostgreSQL connection string (Prisma)
- `DIRECT_URL` — non-pooled connection for migrations (if using a pooler like PgBouncer/Neon)

## Auth
- `AUTH_SECRET` — Auth.js session/JWT signing secret
- `AUTH_URL` — canonical auth callback base URL
- `AUTH_TRUST_HOST` — `true` in containerized/proxy deployments

## File Storage (S3-compatible)
- `STORAGE_ENDPOINT`
- `STORAGE_REGION`
- `STORAGE_BUCKET`
- `STORAGE_ACCESS_KEY_ID`
- `STORAGE_SECRET_ACCESS_KEY`
- `STORAGE_SIGNED_URL_TTL_SECONDS` — default `300`

## Email
- `EMAIL_PROVIDER` — `resend` | `sendgrid` | `smtp`
- `EMAIL_API_KEY`
- `EMAIL_FROM` — e.g. `FastUniApply <no-reply@fastuniapply.com>`

## WhatsApp / Notifications (integration-ready, optional in dev)
- `WHATSAPP_PROVIDER_API_KEY`
- `WHATSAPP_PROVIDER_PHONE_ID`

## Security
- `RATE_LIMIT_REDIS_URL` — optional; falls back to in-memory limiter in dev
- `CRON_SECRET` — shared secret to authorize scheduled job endpoints

## Analytics/SEO (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_SITE_VERIFICATION_GOOGLE`

## Rules
- Every variable consumed on the server is validated at boot via a typed `env.ts`
  (Zod) — the app fails fast with a clear error instead of silently running with
  `undefined` secrets.
- Only `NEXT_PUBLIC_*` variables are ever exposed to the browser bundle.
- `.env`, `.env.local`, `.env*.local` are git-ignored; only `.env.example` is committed.
