import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getScholarshipBySlug, listRelatedScholarships } from "@/server/repositories/scholarship.repository";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { CalendarClock, MapPin, GraduationCap } from "lucide-react";
import { degreeLevelLabel } from "@/components/catalog/program-card";

export async function generateMetadata({
  params: { locale, scholarshipSlug },
}: {
  params: { locale: AppLocale; scholarshipSlug: string };
}): Promise<Metadata> {
  const scholarship = await getScholarshipBySlug(scholarshipSlug, locale);
  if (!scholarship) return {};
  return {
    title: scholarship.translation.title,
    description: scholarship.translation.eligibilityText?.slice(0, 160),
    alternates: { canonical: `/${locale}/scholarships/${scholarshipSlug}` },
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
  const t = scholarship.translation;
  const related = await listRelatedScholarships(scholarship.id, scholarship.countryId, locale, 3);

  return (
    <div>
      <section className="bg-brand-gradient py-14 text-white">
        <div className="container">
          <nav className="mb-4 text-xs text-white/70">
            <Link href={`/${locale}/scholarships`} className="hover:underline">
              Scholarships
            </Link>{" "}
            / {t.title}
          </nav>
          <Badge variant="accent">
            {scholarship.coverageType === "FULL" ? "Full Scholarship" : `${scholarship.coveragePercent ?? ""}% Coverage`}
          </Badge>
          <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{t.title}</h1>
          <p className="mt-1 text-white/85">{t.providerName}</p>
          <div className="mt-6 flex flex-wrap gap-3">
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

          {related.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Scholarships</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {related.map((s) => (
                  <ScholarshipCard
                    key={s.slug}
                    locale={locale}
                    scholarship={{
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
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {scholarship.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-secondary" /> Deadline: {formatDate(scholarship.deadline, locale)}
                </div>
              )}
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
