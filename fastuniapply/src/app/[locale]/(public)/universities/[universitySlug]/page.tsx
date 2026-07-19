import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getUniversityBySlug } from "@/server/repositories/university.repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramCard, degreeLevelLabel } from "@/components/catalog/program-card";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { formatMoney } from "@/lib/format";
import { GraduationCap, MapPin, Award, BadgeCheck, Landmark } from "lucide-react";

export async function generateMetadata({
  params: { locale, universitySlug },
}: {
  params: { locale: AppLocale; universitySlug: string };
}): Promise<Metadata> {
  const university = await getUniversityBySlug(universitySlug, locale);
  if (!university) return {};
  return {
    title: university.translation.name,
    description: university.translation.aboutText?.slice(0, 160) ?? `Study at ${university.translation.name}.`,
    alternates: { canonical: `/${locale}/universities/${universitySlug}` },
  };
}

export default async function UniversityDetailPage({
  params: { locale, universitySlug },
}: {
  params: { locale: AppLocale; universitySlug: string };
}) {
  setRequestLocale(locale);
  const university = await getUniversityBySlug(universitySlug, locale);
  if (!university) notFound();

  const cta = await getTranslations({ locale, namespace: "cta" });
  const t = university.translation;

  const degreeLevels = Array.from(new Set(university.programs.map((p) => p.degreeLevel)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: t.name,
    description: t.aboutText ?? undefined,
    address: { "@type": "PostalAddress", addressCountry: university.country.name },
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-brand-gradient py-14 text-white">
        <div className="container">
          <nav className="mb-4 text-xs text-white/70">
            <Link href={`/${locale}/universities`} className="hover:underline">
              Universities
            </Link>{" "}
            / {t.name}
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-elevated">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{t.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-white/85">
                  <MapPin className="h-4 w-4" /> {university.country.name}
                  {university.rankingGlobal && ` · Ranked #${university.rankingGlobal} globally`}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="border-white/30 bg-white/10 text-white">
                    {university.type === "PUBLIC" ? "Public" : "Private"}
                  </Badge>
                  {university.scholarshipsAvailable && (
                    <Badge variant="accent">Scholarships available</Badge>
                  )}
                  <Badge className="border-white/30 bg-white/10 text-white">{university.programs.length} programs</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href={`/${locale}/apply?university=${university.slug}`}>{cta("applyNow")}</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href={`/${locale}/consultation?university=${university.slug}`}>{cta("requestConsultation")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-10">
          {t.aboutText && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">About</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{t.aboutText}</p>
            </section>
          )}

          <Tabs defaultValue="programs">
            <TabsList>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              {university.scholarships.length > 0 && <TabsTrigger value="scholarships">Scholarships</TabsTrigger>}
              <TabsTrigger value="campus">Campus &amp; Life</TabsTrigger>
            </TabsList>

            <TabsContent value="programs">
              {university.programs.length === 0 ? (
                <p className="text-muted-foreground">No programs listed yet.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {university.programs.map((p) => (
                    <ProgramCard
                      key={p.slug}
                      locale={locale}
                      program={{
                        slug: p.slug,
                        name: p.translation.name,
                        universityName: t.name,
                        degreeLevel: p.degreeLevel,
                        studyLanguage: p.studyLanguage,
                        durationMonths: p.durationMonths,
                        tuitionMinor: p.fees[0]?.tuitionMinor ?? null,
                        currency: p.currency,
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="admissions" className="space-y-6">
              {t.admissionRequirements && (
                <InfoBlock icon={BadgeCheck} title="Admission Requirements" text={t.admissionRequirements} />
              )}
              {t.languageRequirements && (
                <InfoBlock icon={Landmark} title="Language Requirements" text={t.languageRequirements} />
              )}
              {t.requiredDocumentsNote && (
                <InfoBlock icon={BadgeCheck} title="Required Documents" text={t.requiredDocumentsNote} />
              )}
              <div>
                <h3 className="font-display text-base font-semibold">Available Degree Levels</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {degreeLevels.map((d) => (
                    <Badge key={d} variant="muted">
                      {degreeLevelLabel[d]}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {university.scholarships.length > 0 && (
              <TabsContent value="scholarships">
                <div className="grid gap-6 sm:grid-cols-2">
                  {university.scholarships.map((s) => (
                    <ScholarshipCard
                      key={s.slug}
                      locale={locale}
                      scholarship={{
                        slug: s.slug,
                        title: s.translation.title,
                        providerName: s.translation.providerName ?? t.name,
                        coverageType: s.coverageType,
                        coveragePercent: s.coveragePercent ? Number(s.coveragePercent) : null,
                        deadline: s.deadline,
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="campus" className="space-y-6">
              {t.campusInfo && <InfoBlock icon={Landmark} title="Campus" text={t.campusInfo} />}
              {t.accommodationInfo && <InfoBlock icon={Landmark} title="Accommodation" text={t.accommodationInfo} />}
              {t.studentLife && <InfoBlock icon={Award} title="Student Life" text={t.studentLife} />}
              {university.campuses.length > 0 && (
                <div>
                  <h3 className="font-display text-base font-semibold">Campuses</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {university.campuses.map((c) => (
                      <li key={c.id} className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {c.name} — {c.city.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <p className="text-xs text-muted-foreground">Starting tuition</p>
                <p className="font-display text-xl font-bold text-primary">
                  {university.startingTuitionMinor
                    ? formatMoney(university.startingTuitionMinor, university.currency, locale)
                    : "Contact us"}
                  <span className="text-sm font-normal text-muted-foreground"> /year</span>
                </p>
              </div>
              {university.foundedYear && (
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-medium">{university.foundedYear}</p>
                </div>
              )}
              {university.accreditations.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Accreditations</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {university.accreditations.map((a) => (
                      <Badge key={a} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild variant="accent" className="w-full">
                <Link href={`/${locale}/apply?university=${university.slug}`}>{cta("applyNow")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/consultation?university=${university.slug}`}>
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

function InfoBlock({ icon: Icon, title, text }: { icon: typeof Landmark; title: string; text: string }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-display text-base font-semibold">
        <Icon className="h-4 w-4 text-secondary" /> {title}
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
