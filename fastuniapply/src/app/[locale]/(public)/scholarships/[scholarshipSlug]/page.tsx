import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { getScholarshipBySlug, listRelatedScholarships } from "@/server/repositories/scholarship.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { ProgramCard, degreeLevelLabel } from "@/components/catalog/program-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DeadlineDisplay } from "@/components/shared/deadline-display";
import { MapPin, GraduationCap } from "lucide-react";

const criteriaLabel: Record<string, string> = {
  NATIONALITY: "Nationality",
  DEGREE_LEVEL: "Degree Level",
  MIN_GPA: "Minimum GPA",
  LANGUAGE_TEST: "Language Test",
  ACADEMIC_FIELD: "Academic Field",
  OTHER: "Other",
};

export async function generateMetadata({
  params: { locale, scholarshipSlug },
}: {
  params: { locale: AppLocale; scholarshipSlug: string };
}): Promise<Metadata> {
  const scholarship = await getScholarshipBySlug(scholarshipSlug, locale);
  if (!scholarship) return {};
  const title = scholarship.translation.seoTitle || scholarship.translation.title;
  const description = scholarship.translation.seoDescription || scholarship.translation.eligibilityText?.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/scholarships/${scholarshipSlug}` },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function ScholarshipDetailPage({
  params: { locale, scholarshipSlug },
}: {
  params: { locale: AppLocale; scholarshipSlug: string };
}) {
  setRequestLocale(locale);
  const scholarship = await getScholarshipBySlug(scholarshipSlug, locale);
  if (!scholarship) notFound();

  const cta = await getTranslations({ locale, namespace: "cta" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const t = scholarship.translation;
  const related = await listRelatedScholarships(scholarship.id, scholarship.countryId, locale, 3);

  const session = await auth();
  const favoritedIds = await getFavoritedEntityIds(session, "SCHOLARSHIP");

  return (
    <div>
      <section className="bg-brand-gradient py-14 text-white">
        <div className="container">
          <Breadcrumbs
            className="mb-4 text-white/70 [&_a]:text-white/70 [&_span]:text-white"
            items={[
              { label: navT("scholarships"), href: `/${locale}/scholarships` },
              { label: t.title },
            ]}
          />
          <Badge variant="accent">
            {scholarship.coverageType === "FULL" ? "Full Scholarship" : `${scholarship.coveragePercent ?? ""}% Coverage`}
          </Badge>
          <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{t.title}</h1>
          <p className="mt-1 text-white/85">{t.providerName}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <FavoriteButton
              entityType="SCHOLARSHIP"
              entityId={scholarship.id}
              initialFavorited={favoritedIds.has(scholarship.id)}
              locale={locale}
              size="default"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            />
            <Button asChild variant="accent" size="lg">
              <Link href={`/${locale}/apply?scholarship=${scholarship.slug}`}>{cta("applyNow")}</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href={`/${locale}/consultation?scholarship=${scholarship.slug}`}>{cta("requestConsultation")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-8">
          {t.eligibilityText && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Eligibility</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.eligibilityText}</p>
            </section>
          )}

          {scholarship.eligibilityCriteria.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Eligibility Criteria</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {scholarship.eligibilityCriteria.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
                    <span className="font-medium">{criteriaLabel[c.criteriaType] ?? c.criteriaType}:</span>{" "}
                    <span className="text-muted-foreground">{c.value}</span>
                    {c.notes && <p className="mt-1 text-xs text-muted-foreground">{c.notes}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {t.requiredDocumentsNote && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Required Documents</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.requiredDocumentsNote}</p>
            </section>
          )}
          {t.applicationProcess && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Application Process</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.applicationProcess}</p>
            </section>
          )}
          {t.termsAndConditions && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Terms &amp; Conditions</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.termsAndConditions}</p>
            </section>
          )}

          {scholarship.programs.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Eligible Programs</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {scholarship.programs.map((p) => (
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
                      tuitionMinor: null,
                      currency: p.currency,
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {scholarship.relatedUniversities.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Universities</h2>
              <ul className="mt-3 space-y-2">
                {scholarship.relatedUniversities.map((u) => (
                  <li key={u.id}>
                    <Link href={`/${locale}/universities/${u.slug}`} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                      <GraduationCap className="h-4 w-4" /> {u.translation.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Scholarships</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {related.map((s) => (
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
          )}

          {scholarship.articles.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Articles</h2>
              <ul className="mt-3 space-y-2">
                {scholarship.articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/${locale}/articles/${a.slug}`} className="font-medium text-primary hover:underline">
                      {a.translation.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {scholarship.deadline && <DeadlineDisplay date={scholarship.deadline} locale={locale} />}
              {scholarship.country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-secondary" /> {scholarship.country.name}
                </div>
              )}
              {scholarship.university && (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-secondary" />
                  <Link href={`/${locale}/universities/${scholarship.university.slug}`} className="hover:underline">
                    {scholarship.university.translation.name}
                  </Link>
                </div>
              )}
              {scholarship.eligibleDegreeLevels.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Eligible degree levels</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {scholarship.eligibleDegreeLevels.map((d) => (
                      <Badge key={d} variant="outline">
                        {degreeLevelLabel[d]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild variant="accent" className="w-full">
                <Link href={`/${locale}/apply?scholarship=${scholarship.slug}`}>{cta("applyNow")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/consultation?scholarship=${scholarship.slug}`}>
                  {cta("requestConsultation")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
