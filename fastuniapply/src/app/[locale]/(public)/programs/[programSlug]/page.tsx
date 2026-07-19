import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getProgramBySlug } from "@/server/repositories/program.repository";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney, formatDate } from "@/lib/format";
import { Clock, Languages, School, MapPin, CalendarClock } from "lucide-react";

export async function generateMetadata({
  params: { locale, programSlug },
}: {
  params: { locale: AppLocale; programSlug: string };
}): Promise<Metadata> {
  const program = await getProgramBySlug(programSlug, locale);
  if (!program) return {};
  return {
    title: `${program.translation.name} — ${program.university.translation.name}`,
    description: program.translation.overview?.slice(0, 160) ?? undefined,
    alternates: { canonical: `/${locale}/programs/${programSlug}` },
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
  const t = program.translation;
  const fee = program.fees[0];

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
          <nav className="mb-4 text-xs text-white/70">
            <Link href={`/${locale}/programs`} className="hover:underline">
              Programs
            </Link>{" "}
            / {t.name}
          </nav>
          <Badge className="border-white/30 bg-white/10 text-white">{degreeLevelLabel[program.degreeLevel]}</Badge>
          <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">{t.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-white/85">
            <School className="h-4 w-4" />
            <Link href={`/${locale}/universities/${program.university.slug}`} className="hover:underline">
              {program.university.translation.name}
            </Link>
            <span>·</span>
            <MapPin className="h-4 w-4" /> {program.university.country.name}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
                    <CardContent className="flex items-center gap-3 pt-6">
                      <CalendarClock className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-sm font-semibold">{formatDate(intake.startDate, locale)}</p>
                        <p className="text-xs text-muted-foreground">
                          Apply by {formatDate(intake.applicationDeadline, locale)} · {intake.status}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <p className="text-xs text-muted-foreground">Tuition fee</p>
                <p className="font-display text-xl font-bold text-primary">
                  {fee ? formatMoney(fee.tuitionMinor, fee.currency, locale) : "Contact us"}
                  <span className="text-sm font-normal text-muted-foreground"> /year</span>
                </p>
                {fee?.discountedTuitionMinor && (
                  <p className="text-sm text-emerald-700">
                    Discounted: {formatMoney(fee.discountedTuitionMinor, fee.currency, locale)}
                  </p>
                )}
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
