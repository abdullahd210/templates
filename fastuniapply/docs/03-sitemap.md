# Sitemap

All public URLs are locale-prefixed: `/{locale}/...` where `locale` ∈ `en | ar | tr`
(`en` is default and may omit the prefix via middleware rewrite — see architecture doc).
Arabic (`ar`) renders RTL.

## 1. Public Website

```
/                                   Homepage
/about                              About FastUniApply
/universities                       University directory (search + filters)
/universities/[universitySlug]      University details
/programs                           Program directory (search + filters)
/programs/[programSlug]             Program details
/programs/compare                   Program comparison (up to 4)
/scholarships                       Scholarship directory
/scholarships/[scholarshipSlug]     Scholarship details
/study-in                           Study destinations index
/study-in/[countrySlug]             Country study guide (turkiye, hungary, germany,
                                     poland, italy, malaysia, united-kingdom,
                                     united-states, canada, cyprus, uae)
/articles                           Articles index (filterable by category)
/articles/[category]                Category archive
/articles/[articleSlug]             Article details
/apply                              Start application (entry point → wizard)
/apply/[applicationId]/step/[n]     Multi-step application wizard (authenticated)
/consultation                       Free consultation request form
/contact                            Contact page
/success-stories                    Student success stories
/partnerships/universities          University partnerships info
/partnerships/become-a-partner      Become a Partner University (lead form)
/partnerships/become-an-agent       Become an Educational Agent (lead form)
/careers                            Careers
/events                             Events & webinars index
/events/[eventSlug]                 Event details
/faq                                Frequently Asked Questions
/legal/privacy-policy
/legal/terms-and-conditions
/legal/cookie-policy
/legal/refund-policy
/legal/application-service-agreement
/search                             Global search (universities+programs+scholarships+articles)
```

### Auth
```
/login
/register
/forgot-password
/reset-password/[token]
/verify-email/[token]
/logout                             (action route)
```

## 2. Student Dashboard — `/dashboard/...` (role: student)

```
/dashboard                          Overview
/dashboard/profile                  Student profile
/dashboard/applications              List
/dashboard/applications/new          Start new application (wraps /apply wizard)
/dashboard/applications/[id]         Application detail & timeline
/dashboard/applications/[id]/documents
/dashboard/applications/[id]/offers
/dashboard/documents                 Documents Center (all documents, cross-application)
/dashboard/offers                    All offers across applications
/dashboard/payments                  Payments & invoices
/dashboard/payments/[invoiceId]
/dashboard/messages                  Conversations
/dashboard/messages/[conversationId]
/dashboard/support                   Support tickets
/dashboard/support/[ticketId]
/dashboard/appointments              Appointments
/dashboard/favorites                 Saved universities/programs/scholarships/articles
/dashboard/notifications
/dashboard/settings                  Account, language, notification preferences
```

## 3. Admin Dashboard — `/admin/...` (internal staff, permission-gated per module)

```
/admin                               Overview / KPIs
/admin/leads                         CRM: lead list + pipeline board
/admin/leads/[id]
/admin/students
/admin/students/[id]
/admin/applications
/admin/applications/[id]
/admin/universities
/admin/universities/[id]
/admin/universities/[id]/campuses
/admin/universities/[id]/programs
/admin/universities/[id]/representatives
/admin/universities/[id]/contracts
/admin/programs
/admin/programs/[id]
/admin/scholarships
/admin/scholarships/[id]
/admin/content/articles
/admin/content/articles/[id]
/admin/content/categories
/admin/content/faqs
/admin/content/testimonials
/admin/content/success-stories
/admin/content/banners
/admin/content/pages                 Homepage sections / destination pages / nav / footer
/admin/content/seo
/admin/staff                         Staff & role management
/admin/staff/[id]
/admin/roles                         Roles & permissions editor
/admin/finance/invoices
/admin/finance/payments
/admin/finance/commissions
/admin/finance/refunds
/admin/finance/expenses
/admin/reports                       Reports index
/admin/reports/[reportType]
/admin/partners/universities         Partner university accounts
/admin/partners/agents                Agent accounts, approval, territories, commission rules
/admin/settings                      System settings, email templates, notification templates
/admin/activity-logs
```

## 4. Consultant Dashboard — `/consultant/...`

```
/consultant                          Overview (assigned leads/students, deadlines)
/consultant/leads
/consultant/leads/[id]
/consultant/students
/consultant/students/[id]
/consultant/applications
/consultant/applications/[id]
/consultant/messages
/consultant/appointments
/consultant/performance
```

## 5. Admissions Officer Dashboard — `/admissions/...`

```
/admissions                          Overview (queue by status)
/admissions/applications
/admissions/applications/[id]
/admissions/applications/[id]/checklist
/admissions/documents/review-queue
```

## 6. Partner University Portal — `/partner/...`

```
/partner                             Overview (own university stats)
/partner/applications
/partner/applications/[id]
/partner/students
/partner/profile                     Editable university fields (permission-limited)
/partner/messages
```

## 7. Educational Agent Portal — `/agent/...`

```
/agent                               Overview
/agent/leads
/agent/leads/new
/agent/students
/agent/students/[id]
/agent/applications
/agent/applications/[id]
/agent/commissions
/agent/commissions/[statementId]
/agent/resources                     Marketing materials
/agent/register                      Public partnership request (pre-approval)
```

## 8. System / Technical Routes

```
/sitemap.xml
/robots.txt
/api/...                             REST endpoints (see architecture doc)
/api/webhooks/...
/manifest.webmanifest                PWA manifest
```

## SEO-friendly URL examples (from spec, confirmed)

- `/universities/istanbul-biruni-university`
- `/programs/computer-engineering-bachelors`
- `/scholarships/full-scholarship-turkiye`
- `/study-in/hungary`
- `/articles/how-to-apply-to-university`
- `/dashboard/applications`
- `/admin/students`
