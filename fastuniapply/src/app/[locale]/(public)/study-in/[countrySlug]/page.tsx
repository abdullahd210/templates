import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getCountryGuideBySlug } from "@/server/repositories/country.repository";
import { UniversityCard } from "@/components/catalog/university-card";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Landmark,
  DollarSign,
  Stamp,
  Home,
  Briefcase,
  FileCheck,
} from "lucide-react";

export async function generateMetadata({
  params: { locale, countrySlug },
}: {
  params: { locale: AppLocale; countrySlug: string };
}): Promise<Metadata> {
  const country = await getCountryGuideBySlug(countrySlug, locale);
  if (!country) return {};
  return {
    title: `Study in ${country.name}`,
    description: country.guideTranslation.whyStudyHere?.slice(0, 160),
    alternates: { canonical: `/${locale}/study-in/${countrySlug}` },
  };
}

export default async function StudyDestinationDetailPage({
  params: { locale, countrySlug },
}: {
  params: { locale: AppLocale; countrySlug: string };
}) {
  setRequestLocale(locale);
  const country = await getCountryGuideBySlug(countrySlug, locale);
  if (!country) notFound();

  const cta = await getTranslations({ locale, namespace: "cta" });
  const g = country.guideTranslation;

  const sections = [
    { icon: GraduationCap, title: "Why Study Here", text: g.whyStudyHere },
    { icon: Landmark, title: "Education System", text: g.educationSystem },
    { icon: DollarSign, title: "Tuition Fees", text: g.tuitionOverview },
    { icon: DollarSign, title: "Cost of Living", text: g.costOfLiving },
    { icon: Stamp, title: "Student Visa", text: g.visaInformation },
    { icon: Home, title: "Accommodation", text: g.accommodation },
    { icon: Briefcase, title: "Work Opportunities", text: g.workOpportunities },
  ].filter((s): s is { icon: typeof GraduationCap; title: string; text: string } => Boolean(s.text));

  const requiredDocuments = Array.isArray(g.requiredDocuments) ? (g.requiredDocuments as string[]) : [];

  return (
    <div>
      <section className="bg-brand-gradient py-16 text-white">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Study in {country.name}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">{g.whyStudyHere}</p>
          <Button asChild size="lg" variant="accent" className="mt-6">
            <Link href={`/${locale}/consultation?country=${country.slug}`}>{cta("getConsultation")}</Link>
          </Button>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                <s.icon className="h-5 w-5 text-secondary" /> {s.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{s.text}</p>
            </section>
          ))}

          {requiredDocuments.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                <FileCheck className="h-5 w-5 text-secondary" /> Required Documents
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {requiredDocuments.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {doc}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {country.universities.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Top Universities in {country.name}</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {country.universities.map((u) => (
                  <UniversityCard
                    key={u.slug}
                    locale={locale}
                    university={{
                      slug: u.slug,
                      name: u.translation.name,
                      countryName: country.name,
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
          )}

          {country.scholarships.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Scholarships in {country.name}</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {country.scholarships.map((s) => (
                  <ScholarshipCard
                    key={s.slug}
                    locale={locale}
                    scholarship={{
                      slug: s.slug,
                      title: s.translation.title,
                      providerName: s.translation.providerName ?? "FastUniApply Partner",
                      coverageType: s.coverageType,
                      coveragePercent: s.coveragePercent ? Number(s.coveragePercent) : null,
                      deadline: s.deadline,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-soft">
          <p className="font-display text-lg font-semibold">Ready to apply?</p>
          <p className="text-sm text-muted-foreground">
            Get matched with the right university and program in {country.name} through a free consultation.
          </p>
          <Button asChild variant="accent" className="w-full">
            <Link href={`/${locale}/consultation?country=${country.slug}`}>{cta("getConsultation")}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/${locale}/universities?country=${country.slug}`}>{cta("findUniversity")}</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
