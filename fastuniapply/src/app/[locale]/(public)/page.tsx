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
import { UniversityCard } from "@/components/catalog/university-card";
import { ProgramCard } from "@/components/catalog/program-card";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { listFeaturedUniversities } from "@/server/repositories/university.repository";
import { listFeaturedPrograms } from "@/server/repositories/program.repository";
import { listLatestScholarships } from "@/server/repositories/scholarship.repository";
import { listFeaturedTestimonials, getPlatformStats, listFaqs } from "@/server/repositories/testimonial.repository";

export default async function HomePage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  const [universities, programs, scholarships, testimonials, stats, faqs] = await Promise.all([
    listFeaturedUniversities(locale, 4),
    listFeaturedPrograms(locale, 3),
    listLatestScholarships(locale, 3),
    listFeaturedTestimonials(3),
    getPlatformStats(),
    listFaqs("global", null, locale, 5),
  ]);

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
          { value: `${stats.universities}+`, label: t("statsUniversities") },
          { value: `${stats.programs}+`, label: t("statsPrograms") },
          { value: `${stats.countries}`, label: t("statsCountries") },
          { value: `${stats.applications}+`, label: t("statsApplications") },
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
          {universities.map((u) => (
            <UniversityCard
              key={u.slug}
              locale={locale}
              university={{
                id: u.id,
                slug: u.slug,
                name: u.translation.name,
                countryName: u.country.name,
                type: u.type,
                startingTuitionMinor: u.startingTuitionMinor,
                currency: u.currency,
                programsCount: u.programsCount,
                scholarshipsAvailable: u.scholarshipsAvailable,
              }}
            />
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
            {programs.map((p) => (
              <ProgramCard
                key={p.slug}
                locale={locale}
                program={{
                  id: p.id,
                  slug: p.slug,
                  name: p.translation.name,
                  universityName: p.university.translation.name,
                  degreeLevel: p.degreeLevel,
                  studyLanguage: p.studyLanguage,
                  durationMonths: p.durationMonths,
                  tuitionMinor: p.fees[0]?.tuitionMinor ?? null,
                  currency: p.currency,
                }}
              />
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
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s.slug}
              locale={locale}
              scholarship={{
                id: s.id,
                slug: s.slug,
                title: s.translation.title,
                providerName: s.translation.providerName ?? s.university?.translation.name ?? "FastUniApply Partner",
                coverageType: s.coverageType,
                coveragePercent: s.coveragePercent ? Number(s.coveragePercent) : null,
                deadline: s.deadline,
              }}
            />
          ))}
        </div>
      </section>

      <HowItWorks title={t("howItWorks")} />
      <WhyChooseUs title={t("whyChooseUs")} />
      <TestimonialsSection
        title={t("testimonials")}
        testimonials={testimonials.map((tm) => ({
          studentName: tm.studentName,
          quote: tm.quote,
          countryName: tm.country?.name,
          universityName: tm.university?.translations.find((tr) => tr.locale === locale)?.name ?? tm.university?.translations[0]?.name,
          rating: tm.rating,
        }))}
      />

      <section className="bg-brand-gradient py-16 text-white">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to start your journey?</h2>
          <p className="max-w-xl text-white/85">
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
              Tell us a little about your goals and we&apos;ll match you with a consultant within one business day.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>

      <FaqSection
        title={t("faq")}
        items={faqs.map((f) => ({ question: f.translation.question, answer: f.translation.answer }))}
      />

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
