# FastUniApply — Product Requirements Document

## 1. Product Summary

FastUniApply is an international education consultancy platform. It lets prospective
international students discover universities and academic programs, receive
educational consultations, apply to universities, manage application documents, track
application status end-to-end (application → offer → payment → visa → enrollment), and
discover scholarships. Internally, it functions as a student CRM and admissions
operations platform for FastUniApply staff, and as an extranet for partner
universities and educational agents.

This is **not** a marketing landing page — the public site exists primarily to drive
qualified leads and self-serve applications into an operational admissions pipeline.

## 2. Brand

| | |
|---|---|
| Name | FastUniApply |
| Slogan | Your Fast Track to University Admission |
| Alt. slogan | Apply Faster. Study Smarter. Go Global. |
| Personality | Professional, trustworthy, modern, international, student-friendly, fast, premium-but-accessible |
| Primary colors | Bright blue `#1E51F5` (exact brand color), Deep blue `hsl(226 70% 20%)` (a darker tint of the same hue, for large surfaces/text), White `#FFFFFF` |
| Accent | Orange `#F95B1A` (exact brand color) — reserved for conversion CTAs only: Apply, Get Consultation, Submit, and their pill-shaped button treatment |
| Typography | Fredoka (the brand's actual wordmark typeface) for display/headings in English and Turkish; Cairo (rounded, native Arabic) for Arabic — same rounded voice, since Fredoka has no Arabic glyphs. Inter for UI/body copy in all locales. |
| Logo mark | A "Ui" letterform pierced by a lightning bolt, with a gold (`#D59C41`) dot standing in for the "i". Wordmark is two-tone: "Fast" in orange, "UniApply" in blue. Colors and geometry are exact — traced as vector paths from the official brand kit (`FAST_UNI_APPLY_2026_2_1.ai`), not re-approximated. See `src/components/shared/logo.tsx`. |

Full tokens are defined in `tailwind.config.ts` and `src/styles/globals.css`
(`--primary`/`--secondary`/`--accent` CSS variables, plus a `.bg-brand-gradient`
utility for hero/promo sections built in Phase 3).

## 3. Goals

1. Let students self-serve discovery (universities, programs, scholarships, destinations)
   without staff involvement.
2. Convert visitors into qualified leads and, from there, into active applicants.
3. Give FastUniApply staff a single operational system (CRM + admissions ops + finance)
   instead of spreadsheets/WhatsApp.
4. Give partner universities and agents self-service visibility into their own pipeline.
5. Be technically ready for a future React Native / Flutter mobile client to consume the
   same backend.

## 4. Non-Goals (explicitly out of scope for v1)

- Payment processing/settlement with a live PSP (v1 ships proof-of-payment upload +
  manual verification; a Stripe/PSP integration is a documented future extension point).
- Native mobile apps (the backend/API is designed to support them later).
- Real-time video conferencing implementation (v1 stores a meeting link per appointment;
  integration with a specific provider — Zoom/Google Meet — is configurable, not built
  from scratch).
- Automated document translation/certification (v1 tracks translation/certification
  *status* as metadata; the actual translation is a manual/back-office service).

## 5. Primary Personas

- **Prospective Student (Aisha, 19, Nigeria)** — researching Bachelor's programs abroad,
  budget-constrained, wants scholarships, needs guidance on visas.
- **Applying Student (Emre, 24, Egypt)** — has chosen a program, is mid-application,
  uploading documents, waiting on an offer.
- **Educational Consultant (staff)** — owns a portfolio of leads/students, guides them to
  the right program, chases documents, moves them through the pipeline.
- **Admissions Officer (staff)** — verifies documents, submits applications to
  universities, tracks decisions.
- **University Partner Representative** — reviews applicants sent to their institution,
  issues decisions/offers.
- **Educational Agent (external, commission-based)** — sources and submits students,
  tracks commission.
- **Platform Admin** — configures universities/programs/scholarships/content, manages
  staff, oversees finance and reporting.

## 6. Success Metrics (v1)

- Lead → consultation booked conversion rate.
- Lead → application-started conversion rate.
- Application → final acceptance rate.
- Median days per pipeline stage (esp. "documents pending" and "university reviewing").
- Document rejection rate (proxy for guidance quality).
- Consultant/officer workload balance.

## 7. Brand Voice & Content Rules

- Plain, confident, encouraging language — never bureaucratic.
- Every public page ends in a clear next action (Apply / Get Consultation / Explore).
- Orange is used **only** for primary conversion CTAs — never decoratively.
- All user/institution-facing dates and currency are locale-aware (see
  `06-technical-architecture.md` §Localization).

See `05-features-list.md` for the exhaustive feature inventory and
`04-sitemap.md` for information architecture.
