import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { getProgramBySlug } from "@/server/repositories/program.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { CompareButton } from "@/components/catalog/compare-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PriceDisplay } from "@/components/shared/price-display";
import { DeadlineDisplay } from "@/components/shared/deadline-display";
import { AdmissionStatusBadge, FeaturedBadge } from "@/components/shared/status-badge";
import { formatMoney, formatDate } from "@/lib/format";
import { Clock, Languages, School, MapPin } from "lucide-react";

export async function generateMetadata({
  params: { locale, programSlug },
}: {
  params: { locale: AppLocale; programSlug: string };
}): Promise<Metadata> {
  const program = await getProgramBySlug(programSlug, locale);
  if (!program) return {};
  const title = program.translation.seoTitle || `${program.translation.name} — ${program.university.translation.name}`;
  const description = program.translation.seoDescription || program.translation.overview?.slice(0, 160) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/programs/${programSlug}` },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function ProgramDetailPage({
  params: { locale, programSlug },
}: {
  params: { locale: AppLocale; programSlug: string };
}) {
  setRequestLocale(locale);
  const program = await getProgramBySlug(programSlug, locale);
  if (!program) notFound();

  const cta = await getTranslations({ locale, namespace: "cta" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const t = program.translation;
  const fee = program.fees[0];

  const session = await auth();
  const favoritedIds = await getFavoritedEntityIds(session, "PROGRAM");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t.name,
    description: t.overview ?? undefined,
    provider: { "@type": "CollegeOrUniversity", name: program.university.translation.name },
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-brand-gradient py-14 text-white">
        <div className="container">
          <Breadcrumbs
            className="mb-4 text-white/70 [&_a]:text-white/70 [&_span]:text-white"
            items={[
              { label: navT("programs"), href: `/${locale}/programs` },
              { label: t.name },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-white/30 bg-white/10 text-white">{degreeLevelLabel[program.degreeLevel]}</Badge>
            {program.featured && <FeaturedBadge />}
            <AdmissionStatusBadge status={program.admissionStatus} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{t.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-white/85">
            <School className="h-4 w-4" />
            <Link href={`/${locale}/universities/${program.university.slug}`} className="hover:underline">
              {program.university.translation.name}
            </Link>
            <span>·</span>
            <MapPin className="h-4 w-4" /> {program.university.country.name}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <FavoriteButton
              entityType="PROGRAM"
              entityId={program.id}
              initialFavorited={favoritedIds.has(program.id)}
              locale={locale}
              size="default"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            />
            <CompareButton kind="programs" slug={program.slug} className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
            <Button asChild variant="accent" size="lg">
              <Link href={`/${locale}/apply?program=${program.slug}`}>{cta("applyNow")}</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href={`/${locale}/consultation?program=${program.slug}`}>{cta("requestConsultation")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-8">
          {t.overview && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Overview</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.overview}</p>
            </section>
          )}
          {t.curriculumSummary && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Curriculum</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.curriculumSummary}</p>
            </section>
          )}
          {t.admissionRequirements && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Admission Requirements</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.admissionRequirements}</p>
            </section>
          )}
          {t.careerOpportunities && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Career Opportunities</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.careerOpportunities}</p>
            </section>
          )}
          {program.requirements.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Required Documents</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {program.requirements.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {r.documentType.key.replace(/_/g, " ")}
                    {r.mandatory && <Badge variant="outline">Required</Badge>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {program.intakes.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Intake Dates</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {program.intakes.map((intake) => (
                  <Card key={intake.id}>
                    <CardContent className="space-y-1 pt-6">
                      <p className="text-sm font-semibold">{formatDate(intake.startDate, locale)}</p>
                      <DeadlineDisplay date={intake.applicationDeadline} locale={locale} label="Apply by" />
                      <AdmissionStatusBadge status={intake.status} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
          {program.articles.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Articles</h2>
              <ul className="mt-3 space-y-2">
                {program.articles.map((a) => (
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
              <div>
                <p className="text-xs text-muted-foreground">Tuition fee</p>
                <PriceDisplay
                  amountMinor={fee?.tuitionMinor ?? null}
                  discountedAmountMinor={fee?.discountedTuitionMinor}
                  currency={fee?.currency ?? program.currency}
                  locale={locale}
                  size="lg"
                  suffix="/year"
                />
              </div>
              {program.applicationFeeMinor > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Application fee</p>
                  <p className="font-medium">{formatMoney(program.applicationFeeMinor, program.currency, locale)}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-secondary" /> {program.durationMonths} months
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Languages className="h-4 w-4 text-secondary" /> {program.studyLanguage}
              </div>
              {program.scholarships.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Available scholarships</p>
                  <ul className="mt-1 space-y-1">
                    {program.scholarships.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/${locale}/scholarships/${s.slug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {s.translation.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button asChild variant="accent" className="w-full">
                <Link href={`/${locale}/apply?program=${program.slug}`}>{cta("applyNow")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/consultation?program=${program.slug}`}>{cta("requestConsultation")}</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
