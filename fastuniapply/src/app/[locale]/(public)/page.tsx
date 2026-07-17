import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { SectionHeading } from "@/components/marketing/section-heading";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { WhyChooseUs } from "@/components/marketing/why-choose-us";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { UniversityCard, type UniversityCardData } from "@/components/catalog/university-card";
import { ProgramCard, type ProgramCardData } from "@/components/catalog/program-card";
import { ScholarshipCard, type ScholarshipCardData } from "@/components/catalog/scholarship-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Demo content below stands in for the Prisma-backed queries wired in Phase 3
// (docs/08-development-roadmap.md). Shapes match the catalog card props exactly
// so swapping in `db.university.findMany(...)` etc. requires no card changes.

const demoUniversities: UniversityCardData[] = [
  { slug: "istanbul-biruni-university", name: "Istanbul Biruni University", countryName: "Türkiye", city: "Istanbul", type: "PRIVATE", startingTuitionMinor: 250000, currency: "USD", programsCount: 42, scholarshipsAvailable: true },
  { slug: "eotvos-lorand-university", name: "Eötvös Loránd University", countryName: "Hungary", city: "Budapest", type: "PUBLIC", startingTuitionMinor: 350000, currency: "USD", programsCount: 58, scholarshipsAvailable: true },
  { slug: "srh-berlin-university", name: "SRH Berlin University", countryName: "Germany", city: "Berlin", type: "PRIVATE", startingTuitionMinor: 900000, currency: "USD", programsCount: 24, scholarshipsAvailable: false },
  { slug: "university-of-warsaw", name: "University of Warsaw", countryName: "Poland", city: "Warsaw", type: "PUBLIC", startingTuitionMinor: 300000, currency: "USD", programsCount: 61, scholarshipsAvailable: true },
];

const demoPrograms: ProgramCardData[] = [
  { slug: "computer-engineering-bachelors", name: "Computer Engineering", universityName: "Istanbul Biruni University", degreeLevel: "BACHELORS", studyLanguage: "English", durationMonths: 48, tuitionMinor: 280000, currency: "USD" },
  { slug: "international-business-masters", name: "International Business", universityName: "Eötvös Loránd University", degreeLevel: "MASTERS", studyLanguage: "English", durationMonths: 24, tuitionMinor: 400000, currency: "USD" },
  { slug: "general-medicine-medical-specialization", name: "General Medicine", universityName: "Poznan University of Medical Sciences", degreeLevel: "MEDICAL_SPECIALIZATION", studyLanguage: "English", durationMonths: 72, tuitionMinor: 1200000, currency: "USD" },
];

const demoScholarships: ScholarshipCardData[] = [
  { slug: "full-scholarship-turkiye", title: "Türkiye Bilim Full Scholarship", providerName: "Türkiye Ministry of Education", coverageType: "FULL", coveragePercent: null, deadline: "2026-09-30" },
  { slug: "central-european-partial-award", title: "Central European Partial Award", providerName: "Eötvös Loránd University", coverageType: "PARTIAL", coveragePercent: 50, deadline: "2026-08-15" },
];

const demoTestimonials = [
  { studentName: "Amara O.", quote: "FastUniApply guided me from choosing a program to landing at my dorm in Istanbul. I never felt lost.", countryName: "Türkiye", universityName: "Istanbul Biruni University" },
  { studentName: "Farid K.", quote: "My consultant caught a missing document three times before submission — that attention to detail got me in.", countryName: "Hungary", universityName: "Eötvös Loránd University" },
  { studentName: "Layla H.", quote: "The scholarship search alone saved me thousands. Everything was in one dashboard.", countryName: "Poland", universityName: "University of Warsaw" },
];

const demoFaqs = [
  { question: "Is FastUniApply free for students?", answer: "Discovery, comparison, and consultation are free. Some application services carry a service fee, shown transparently before you pay." },
  { question: "Which countries can I apply to?", answer: "We currently support Türkiye, Hungary, Germany, Poland, Italy, Malaysia, the UK, the US, Canada, Cyprus, and the UAE." },
  { question: "How do I track my application?", answer: "Every application has a live status timeline in your student dashboard, from Draft through Enrollment." },
];

export default async function HomePage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  return (
    <>
      <Hero
        locale={locale}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        searchPlaceholder={t("searchPlaceholder")}
        ctas={{
          findUniversity: cta("findUniversity"),
          explorePrograms: cta("explorePrograms"),
          startApplication: cta("startApplication"),
          getConsultation: cta("getConsultation"),
        }}
      />

      <StatsBar
        stats={[
          { value: "120+", label: t("statsUniversities") },
          { value: "3,400+", label: t("statsPrograms") },
          { value: "11", label: t("statsCountries") },
          { value: "8,900+", label: t("statsApplications") },
        ]}
      />

      <section className="container py-16">
        <SectionHeading
          eyebrow="Universities"
          title={t("featuredUniversities")}
          viewAllHref={`/${locale}/universities`}
          viewAllLabel={cta("viewAll")}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoUniversities.map((u) => (
            <UniversityCard key={u.slug} university={u} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Programs"
            title={t("featuredPrograms")}
            viewAllHref={`/${locale}/programs`}
            viewAllLabel={cta("viewAll")}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoPrograms.map((p) => (
              <ProgramCard key={p.slug} program={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading
          eyebrow="Scholarships"
          title={t("latestScholarships")}
          viewAllHref={`/${locale}/scholarships`}
          viewAllLabel={cta("viewAll")}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoScholarships.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} locale={locale} />
          ))}
        </div>
      </section>

      <HowItWorks title={t("howItWorks")} />
      <WhyChooseUs title={t("whyChooseUs")} />
      <TestimonialsSection title={t("testimonials")} testimonials={demoTestimonials} />

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ready to start your journey?
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            Get matched with the right university and program in a free 20-minute consultation.
          </p>
          <Button asChild size="lg" variant="accent">
            <Link href={`/${locale}/consultation`}>{cta("getConsultation")}</Link>
          </Button>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Get Started" title="Talk to an education consultant" />
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Tell us a little about your goals and we&apos;ll match you with a consultant
              within one business day.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>

      <FaqSection title={t("faq")} items={demoFaqs} />

      <section className="border-t border-border bg-muted/40 py-14">
        <div className="container flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-xl font-bold text-primary">{t("newsletterTitle")}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{t("newsletterSubtitle")}</p>
          <form className="mt-2 flex w-full max-w-sm gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-lg border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit">{cta("subscribe")}</Button>
          </form>
        </div>
      </section>
    </>
  );
}
