# Database Schema & ERD

Full implementation lives in `prisma/schema.prisma` (source of truth). This document
gives the conceptual model grouped by domain, since a single 60+-entity diagram is
unreadable. All tables include `id (cuid)`, `createdAt`, `updatedAt`, `deletedAt`
(soft delete) unless noted; audit-sensitive tables additionally get `createdById`.

## Conventions

- Soft delete: `deletedAt DateTime?`; all repository queries default-filter `deletedAt: null`.
- Money: `amountMinor Int` + `currency String (ISO 4217)`.
- Localized text fields (name/description/etc. on catalog + content entities) live in a
  companion `*Translation` table keyed by `(entityId, locale)` rather than duplicate
  columns per language — this is the **Localized Content pattern** referenced by every
  domain below.
- Enums are defined once in Prisma and reused (`ApplicationStatus`, `LeadStage`, etc.)

---

## 1. Identity & Access

```mermaid
erDiagram
  USER ||--o{ USER_ROLE : has
  ROLE ||--o{ USER_ROLE : grants
  ROLE ||--o{ ROLE_PERMISSION : includes
  PERMISSION ||--o{ ROLE_PERMISSION : "granted via"
  USER ||--o| STUDENT_PROFILE : "is a"
  USER ||--o| STAFF_PROFILE : "is a"
  USER ||--o| AGENT_PROFILE : "is a"
  USER ||--o| PARTNER_REP_PROFILE : "is a"
  UNIVERSITY ||--o{ PARTNER_REP_PROFILE : employs

  USER {
    string id PK
    string email UK
    string passwordHash
    string phone
    string preferredLocale
    bool emailVerified
    bool isActive
    datetime lastLoginAt
  }
  ROLE {
    string id PK
    string key UK "super_admin, consultant, student, ..."
    string name
  }
  PERMISSION {
    string id PK
    string key UK "applications.update_status"
  }
  STUDENT_PROFILE {
    string id PK
    string userId FK
    string nationality
    string residenceCountryId FK
    date dateOfBirth
    string passportNumber
    json academicBackground
    json languageProficiency
    json studyPreferences
    int budgetMinorAmount
    string assignedConsultantId FK
  }
  STAFF_PROFILE {
    string id PK
    string userId FK
    string department
    string title
    bool twoFactorEnabled
  }
  AGENT_PROFILE {
    string id PK
    string userId FK
    string companyName
    string territory
    string status "pending, approved, suspended"
    decimal commissionRate
  }
  PARTNER_REP_PROFILE {
    string id PK
    string userId FK
    string universityId FK
    string title
  }
```

## 2. Catalog: Geography, Universities & Programs

```mermaid
erDiagram
  COUNTRY ||--o{ CITY : contains
  COUNTRY ||--o{ UNIVERSITY : "located in"
  CITY ||--o{ UNIVERSITY_CAMPUS : hosts
  UNIVERSITY ||--o{ UNIVERSITY_CAMPUS : has
  UNIVERSITY ||--o{ PROGRAM : offers
  UNIVERSITY ||--o{ UNIVERSITY_REPRESENTATIVE : has
  UNIVERSITY ||--o{ UNIVERSITY_CONTRACT : has
  UNIVERSITY ||--o{ UNIVERSITY_COMMISSION_RULE : has
  PROGRAM ||--o{ PROGRAM_INTAKE : has
  PROGRAM ||--o{ PROGRAM_FEE : has
  PROGRAM ||--o{ PROGRAM_REQUIREMENT : has
  PROGRAM }o--o{ SCHOLARSHIP : "eligible for"
  UNIVERSITY }o--o{ SCHOLARSHIP : offers

  COUNTRY {
    string id PK
    string isoCode UK
    string slug UK
  }
  CITY {
    string id PK
    string countryId FK
    string name
  }
  UNIVERSITY {
    string id PK
    string slug UK
    string countryId FK
    string logoUrl
    string coverImageUrl
    string type "public, private"
    int rankingGlobal
    int rankingNational
    string[] accreditations
    bool scholarshipsAvailable
    string admissionStatus "open, closed, upcoming"
    int startingTuitionMinor
    string currency
  }
  UNIVERSITY_CAMPUS {
    string id PK
    string universityId FK
    string cityId FK
    string name
    geo location
  }
  UNIVERSITY_REPRESENTATIVE {
    string id PK
    string universityId FK
    string userId FK
  }
  UNIVERSITY_CONTRACT {
    string id PK
    string universityId FK
    date startDate
    date endDate
    string documentUrl
  }
  UNIVERSITY_COMMISSION_RULE {
    string id PK
    string universityId FK
    decimal rate
    string basis "per_enrollment, percent_tuition"
  }
  PROGRAM {
    string id PK
    string slug UK
    string universityId FK
    string degreeLevel "foundation, diploma, bachelors, masters, phd, medical_specialization, language"
    string field
    string major
    string studyLanguage
    int durationMonths
    int applicationFeeMinor
    bool featured
    bool applicationsEnabled
    string admissionStatus
  }
  PROGRAM_INTAKE {
    string id PK
    string programId FK
    date startDate
    date applicationDeadline
    string status "open, closed, upcoming"
  }
  PROGRAM_FEE {
    string id PK
    string programId FK
    int tuitionMinor
    int discountedTuitionMinor
    string currency
    string period "per_year, total"
  }
  PROGRAM_REQUIREMENT {
    string id PK
    string programId FK
    string documentTypeId FK
    bool mandatory
    string note
  }
  SCHOLARSHIP {
    string id PK
    string slug UK
    string universityId FK "nullable, provider-only scholarships"
    string countryId FK
    string coverageType "full, partial"
    decimal coveragePercent
    string fundingType
    date deadline
    string[] eligibleDegreeLevels
    string[] eligibleNationalities
    bool visible
  }
```

## 3. Applications, Documents, Offers

```mermaid
erDiagram
  STUDENT_PROFILE ||--o{ APPLICATION : submits
  PROGRAM ||--o{ APPLICATION : "applied to"
  APPLICATION ||--o{ APPLICATION_STATUS_HISTORY : logs
  APPLICATION ||--o{ APPLICATION_NOTE : has
  APPLICATION ||--o{ DOCUMENT : requires
  DOCUMENT_TYPE ||--o{ DOCUMENT : categorizes
  DOCUMENT ||--o| DOCUMENT_VERIFICATION : "verified by"
  APPLICATION ||--o{ OFFER : receives
  OFFER ||--o| ACCEPTANCE_LETTER : "backed by"
  STAFF_PROFILE ||--o{ APPLICATION : "assigned officer"
  STUDENT_PROFILE ||--o{ STAFF_PROFILE : "assigned consultant"

  APPLICATION {
    string id PK
    string studentId FK
    string programId FK
    string status "enum, 20 values"
    string assignedConsultantId FK
    string assignedOfficerId FK
    date submissionDeadline
    string createdBy "student, consultant, agent"
    string sourceAgentId FK
  }
  APPLICATION_STATUS_HISTORY {
    string id PK
    string applicationId FK
    string fromStatus
    string toStatus
    string actorUserId FK
    string note
    datetime changedAt
  }
  APPLICATION_NOTE {
    string id PK
    string applicationId FK
    string authorId FK
    string body
    bool internalOnly
  }
  DOCUMENT_TYPE {
    string id PK
    string key UK "passport, transcript, sop, ..."
    bool requiresExpiration
  }
  DOCUMENT {
    string id PK
    string studentId FK
    string applicationId FK "nullable, can be a profile-level doc"
    string documentTypeId FK
    string fileKey "private storage key"
    string originalFilename
    int fileSizeBytes
    string mimeType
    date expirationDate
    string translationStatus
    string certificationStatus
  }
  DOCUMENT_VERIFICATION {
    string id PK
    string documentId FK
    string status "pending, approved, rejected"
    string reviewerId FK
    string comment
    datetime reviewedAt
  }
  OFFER {
    string id PK
    string applicationId FK
    string type "conditional, final"
    date depositDeadline
    int depositAmountMinor
    string status "pending, accepted, declined"
  }
  ACCEPTANCE_LETTER {
    string id PK
    string offerId FK
    string fileKey
    datetime issuedAt
  }
```

## 4. CRM: Leads, Consultations, Appointments

```mermaid
erDiagram
  LEAD_SOURCE ||--o{ LEAD : originates
  LEAD ||--o{ LEAD_ACTIVITY : logs
  LEAD ||--o| STUDENT_PROFILE : "converts to"
  STAFF_PROFILE ||--o{ LEAD : "assigned to"
  AGENT_PROFILE ||--o{ LEAD : "sourced by"
  STUDENT_PROFILE ||--o{ CONSULTATION : books
  STUDENT_PROFILE ||--o{ APPOINTMENT : books
  STAFF_PROFILE ||--o{ APPOINTMENT : hosts

  LEAD_SOURCE {
    string id PK
    string key UK "website, whatsapp, instagram, ..."
  }
  LEAD {
    string id PK
    string fullName
    string email
    string phone
    string whatsapp
    string nationality
    string desiredCountryId FK
    string desiredMajor
    int budgetMinor
    string stage "enum, 12 values"
    string sourceId FK
    string assignedStaffId FK
    string assignedAgentId FK
    string convertedStudentId FK
    datetime nextFollowUpAt
  }
  LEAD_ACTIVITY {
    string id PK
    string leadId FK
    string actorId FK
    string type "note, call, stage_change, email"
    string body
  }
  CONSULTATION {
    string id PK
    string studentId FK
    string leadId FK
    string preferredTime
    string mode "online, in_office"
    string status
    string notes
  }
  APPOINTMENT {
    string id PK
    string studentId FK
    string staffId FK
    string mode "online, in_office"
    datetime scheduledAt
    string meetingUrl
    string status "scheduled, rescheduled, cancelled, completed"
  }
```

## 5. Payments & Finance

```mermaid
erDiagram
  STUDENT_PROFILE ||--o{ INVOICE : billed
  INVOICE ||--o{ PAYMENT : "paid via"
  PAYMENT ||--o| PAYMENT_PROOF : evidenced
  APPLICATION ||--o{ INVOICE : "relates to"
  AGENT_PROFILE ||--o{ AGENT_COMMISSION : earns
  UNIVERSITY ||--o{ UNIVERSITY_COMMISSION : accrues

  INVOICE {
    string id PK
    string studentId FK
    string applicationId FK
    string type "service_fee, application_fee, tuition_deposit, translation, visa_support, accommodation"
    int amountMinor
    string currency
    string status "unpaid, paid, partially_paid, void"
    date dueDate
  }
  PAYMENT {
    string id PK
    string invoiceId FK
    int amountMinor
    string status "pending, under_review, confirmed, rejected, refunded, partially_paid"
    datetime submittedAt
    string confirmedById FK
  }
  PAYMENT_PROOF {
    string id PK
    string paymentId FK
    string fileKey
  }
  AGENT_COMMISSION {
    string id PK
    string agentId FK
    string applicationId FK
    int amountMinor
    string status "accrued, approved, paid"
  }
  UNIVERSITY_COMMISSION {
    string id PK
    string universityId FK
    string applicationId FK
    int amountMinor
    string status
  }
```

## 6. Communication & Notifications

```mermaid
erDiagram
  CONVERSATION ||--o{ CONVERSATION_PARTICIPANT : includes
  CONVERSATION ||--o{ MESSAGE : contains
  USER ||--o{ MESSAGE : sends
  USER ||--o{ SUPPORT_TICKET : opens
  SUPPORT_TICKET ||--o{ SUPPORT_TICKET_MESSAGE : contains
  USER ||--o{ NOTIFICATION : receives

  CONVERSATION {
    string id PK
    string subject
    string context "application, general, support"
    string contextId
  }
  CONVERSATION_PARTICIPANT {
    string id PK
    string conversationId FK
    string userId FK
  }
  MESSAGE {
    string id PK
    string conversationId FK
    string senderId FK
    string body
    string[] attachmentFileKeys
    datetime readAt
  }
  SUPPORT_TICKET {
    string id PK
    string studentId FK
    string subject
    string status "open, pending, resolved, closed"
    string priority
  }
  SUPPORT_TICKET_MESSAGE {
    string id PK
    string ticketId FK
    string senderId FK
    string body
  }
  NOTIFICATION {
    string id PK
    string userId FK
    string type
    string title
    string body
    string linkUrl
    bool read
    string channel "in_app, email, whatsapp"
  }
```

## 7. Content (CMS)

```mermaid
erDiagram
  ARTICLE_CATEGORY ||--o{ ARTICLE : categorizes
  ARTICLE }o--o{ UNIVERSITY : references
  ARTICLE }o--o{ PROGRAM : references
  ARTICLE }o--o{ SCHOLARSHIP : references

  ARTICLE {
    string id PK
    string slug UK
    string categoryId FK
    string authorId FK
    string featuredImageUrl
    int readingTimeMinutes
    bool published
    datetime publishedAt
  }
  ARTICLE_CATEGORY {
    string id PK
    string key UK
  }
  FAQ {
    string id PK
    string context "global, university, program, scholarship, country"
    string contextId
    int order
  }
  TESTIMONIAL {
    string id PK
    string studentName
    string quote
    string countryId FK
    string universityId FK
    bool featured
  }
  SUCCESS_STORY {
    string id PK
    string studentId FK
    string title
    string body
    string universityId FK
  }
  BANNER {
    string id PK
    string placement "homepage_hero, sidebar, ..."
    string imageUrl
    string linkUrl
    bool active
  }
```

Every content entity above (`University`, `Program`, `Scholarship`, `Article`,
`Country` study guides, `FAQ`, `Testimonial`) has a matching `*Translation` table:

```mermaid
erDiagram
  UNIVERSITY ||--o{ UNIVERSITY_TRANSLATION : has
  UNIVERSITY_TRANSLATION {
    string id PK
    string universityId FK
    string locale "en, ar, tr"
    string name
    string aboutText
    json admissionRequirements
    json studentLife
  }
```
(identical pattern applied to `ProgramTranslation`, `ScholarshipTranslation`,
`ArticleTranslation`, `CountryGuideTranslation`, `FAQTranslation`)

## 8. Favorites, Comparison, Partners

```mermaid
erDiagram
  USER ||--o{ FAVORITE : saves
  USER ||--o{ COMPARISON_LIST : builds

  FAVORITE {
    string id PK
    string userId FK
    string entityType "university, program, scholarship, article"
    string entityId
  }
  COMPARISON_LIST {
    string id PK
    string userId FK
    string entityType "university, program"
    string[] entityIds
  }
  PARTNER {
    string id PK
    string type "university, agent"
    string entityId
    string status "pending, approved, suspended"
  }
```

## 9. Platform / System

```mermaid
erDiagram
  AUDIT_LOG {
    string id PK
    string actorId FK
    string action
    string entityType
    string entityId
    json before
    json after
    string ipAddress
    datetime createdAt
  }
  EMAIL_TEMPLATE {
    string id PK
    string key UK
    string locale
    string subject
    string bodyHtml
  }
  NOTIFICATION_TEMPLATE {
    string id PK
    string key UK
    string locale
    string channel
    string body
  }
  SETTING {
    string id PK
    string key UK
    json value
  }
```

## 10. Enumerations (Prisma `enum`)

- `ApplicationStatus` — the 20 values listed in the product spec (`Draft` … `Closed`).
- `LeadStage` — the 12 values listed in the product spec.
- `LeadSourceKey`, `DegreeLevel`, `PaymentStatus`, `DocumentVerificationStatus`,
  `ScholarshipCoverageType`, `AppointmentMode`, `AppointmentStatus`,
  `AgentStatus`, `PartnerStatus`.

All enums are centralized at the top of `prisma/schema.prisma` and re-exported as
TypeScript types via `@prisma/client` — never redefined ad hoc in application code.
