# Roles, Permissions & User Journeys

## 1. Role Model

FastUniApply uses **RBAC with module-level + action-level permissions**, evaluated
server-side on every request (never trust client-side role checks alone).

```
User 1---* UserRole *---1 Role 1---* RolePermission *---1 Permission
```

- A `User` can hold multiple `Role`s (e.g., a consultant who is also a content editor).
- A `Permission` is `<module>.<action>` e.g. `applications.update_status`,
  `documents.verify`, `finance.view_revenue`.
- `Role` is seed data but editable by Super Administrator (custom roles beyond the
  defaults below are supported by the schema, not just the enum).

## 2. Roles

### External / self-service roles

| Role | Scope |
|---|---|
| **Student** | Own profile, own applications/documents/payments/messages only |
| **Guest / Lead** | Pre-account; identified by a Lead record until converted |
| **University Partner Rep** | Own university's applications/students/offers only |
| **Educational Agent** | Own submitted students/leads/commissions only |

### Internal staff roles

| Role | Primary responsibility |
|---|---|
| **Super Administrator** | Full system access, staff & role management, system settings |
| **General Manager** | Full read access + high-level reports, approvals |
| **Operations Manager** | Oversees admissions + consultant teams, escalations |
| **Educational Consultant** | Owns assigned leads/students, guidance, application creation |
| **Admissions Officer** | Document verification, application submission to universities |
| **Sales Representative** | Lead intake, qualification, handoff to consultants |
| **Marketing Manager** | Campaigns, lead source tracking, CMS banners/homepage |
| **Content Editor** | Articles, FAQs, destination pages, testimonials, SEO metadata |
| **Finance Officer** | Invoices, payments, commissions, refunds, revenue reports |
| **Student Support Officer** | Messaging/tickets, appointment coordination |
| **Quality & Analytics Officer** | Reporting dashboards, data export, process QA |

## 3. Permission Matrix (module × role)

`F` = full, `O` = own/assigned records only, `R` = read-only, `–` = none

| Module | Super Admin | Gen. Mgr | Ops Mgr | Consultant | Admissions Officer | Sales Rep | Marketing | Content Editor | Finance | Support | Analytics | Partner Rep | Agent | Student |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Leads (CRM) | F | R | F | O | O(intake) | O | R | – | – | R | R | – | O(own) | – |
| Students | F | R | F | O | O | – | – | – | R | O | R | – | O(own) | O(self) |
| Applications | F | R | F | O | O | – | – | – | R | R | R | O(own univ.) | O(own) | O(self) |
| Documents | F | R | F | O | F(verify) | – | – | – | – | R | R | O(own univ.) | O(own) | O(self, upload) |
| Universities/Programs | F | R | R | R | R | R | R | R | R | R | R | O(own, limited fields) | R | R(public) |
| Scholarships | F | R | R | R | R | R | R | R | R | R | R | O(own) | R | R(public) |
| CMS (articles, FAQs, pages) | F | R | – | – | – | – | F | F | – | – | R | – | – | R(public) |
| Finance (invoices/payments/commissions) | F | R | R | – | – | – | – | – | F | – | R | R(own invoices) | R(own commissions) | O(self) |
| Staff & Roles | F | R | – | – | – | – | – | – | – | – | – | – | – | – |
| Reports/Analytics | F | F | F | O(own) | O(own) | O(own) | R(marketing) | – | R(finance) | – | F | O(own) | O(own) | – |
| Activity/Audit Logs | F | R | R | – | – | – | – | – | – | – | R | – | – | – |
| Messaging/Support | F | R | R | O | O | O | – | – | – | F | – | O(own) | O(own) | O(self) |
| Appointments | F | R | R | O | O | O | – | – | – | F | – | – | – | O(self) |

All server actions/API routes re-validate the acting user's permission for the
specific resource (row-level ownership check, not just role check) — see
`06-technical-architecture.md` §Security.

## 4. Key User Journeys

### 4.1 Anonymous visitor → Lead
Homepage/search → University or Program detail → "Get Free Consultation" or lead
capture form → Lead created (`source = website`) → auto-assigned or queued for Sales
Rep → follow-up.

### 4.2 Lead → Student → Applicant
Sales Rep/Consultant contacts lead → consultation booked & completed → lead marked
`Interested`/`Documents requested` → lead **converted** to a `Student` account
(invite email + password setup) → Consultant creates first `Application` on the
student's behalf, or student self-starts the 14-step application wizard → status
`Draft`.

### 4.3 Application lifecycle (student-facing)
`Draft` → `Consultation required` / `Documents pending` → student uploads documents in
Documents Center → Admissions Officer verifies → `Ready for submission` →
`Submitted to university` → `University reviewing` (partner portal) →
`Conditional acceptance` / `Rejected` → student uploads outstanding items →
`Final acceptance` → student reviews Offer, accepts → `Deposit pending` → student
submits payment proof → Finance confirms → `Payment confirmed` → `Visa preparation` →
`Visa application submitted` → `Visa approved`/`Visa rejected` → `Enrollment completed`
→ `Arrived at destination` → `Closed`.

Every transition writes an `ApplicationStatusHistory` row (actor, from, to, timestamp,
note) for audit and student-facing timeline display.

### 4.4 Consultant day-to-day
Dashboard (assigned leads/students, deadlines, follow-ups due today) → open a student →
add consultation notes → recommend universities/programs → create/update an
application → message student → schedule appointment.

### 4.5 Admissions Officer day-to-day
Queue of applications in `Documents under review`/`Ready for submission` → open
application → verify each document (approve/reject with comment) → once complete,
mark `Ready for submission` → submit to university (records outbound communication) →
later, upload the university's decision/acceptance letter → status auto-advances.

### 4.6 Partner University Rep
Login → dashboard scoped to their university only → list of submitted applicants →
open application → view documents (read-only, signed URLs) → request additional
documents (creates a note + student notification) → record decision (conditional/final
acceptance, rejection) → upload official acceptance letter.

### 4.7 Educational Agent
Registers/requests partnership → Admin approves + sets commission rules → Agent
submits a lead or creates a student directly → tracks the student's application read-only
progress → on `Payment confirmed`, a commission accrual is generated → Agent views/downloads
commission statements.

### 4.8 Admin operational loop
Overview dashboard (leads, conversion, revenue, alerts) → Lead/Student/Application
management → University/Program/Scholarship catalog management → Staff & role
management → Finance → Reports/export → CMS.
