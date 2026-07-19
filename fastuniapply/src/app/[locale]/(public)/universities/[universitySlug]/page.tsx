import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { getUniversityBySlug } from "@/server/repositories/university.repository";
import { listFaqs } from "@/server/repositories/testimonial.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramCard, degreeLevelLabel } from "@/components/catalog/program-card";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { CompareButton } from "@/components/catalog/compare-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PriceDisplay } from "@/components/shared/price-display";
import { DeadlineDisplay } from "@/components/shared/deadline-display";
import { AdmissionStatusBadge, FeaturedBadge } from "@/components/shared/status-badge";
import { GraduationCap, MapPin, Award, BadgeCheck, Landmark, Trophy } from "lucide-react";

export async function generateMetadata({
  params: { locale, universitySlug },
}: {
  params: { locale: AppLocale; universitySlug: string };
}): Promise<Metadata> {
  const university = await getUniversityBySlug(universitySlug, locale);
  if (!university) return {};
  const title = university.translation.seoTitle || university.translation.name;
  const description =
    university.translation.seoDescription ||
    university.translation.aboutText?.slice(0, 160) ||
    `Study at ${university.translation.name} in ${university.country.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/universities/${universitySlug}` },
    openGraph: { title, description, images: university.coverImageUrl ? [university.coverImageUrl] : undefined },
    twitter: { card: "summary_large_image", title, description },
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
  const navT = await getTranslations({ locale, namespace: "nav" });
  const t = university.translation;

  const session = await auth();
  const [favoritedIds, faqs] = await Promise.all([
    getFavoritedEntityIds(session, "UNIVERSITY"),
    listFaqs("university", university.id, locale, 10),
  ]);

  const degreeLevels = Array.from(new Set(university.programs.map((p) => p.degreeLevel)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: t.name,
    description: t.aboutText ?? undefined,
    address: { "@type": "PostalAddress", addressCountry: university.country.name },
    image: university.coverImageUrl ?? undefined,
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
              { label: navT("universities"), href: `/${locale}/universities` },
              { label: t.name },
            ]}
          />
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-elevated">
                {university.logoUrl ? (
                  <Image src={university.logoUrl} alt={t.name} width={48} height={48} className="rounded" />
                ) : (
                  <GraduationCap className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{t.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-white/85">
                  <MapPin className="h-4 w-4" /> {university.country.name}
                  {university.rankingGlobal && ` · Ranked #${university.rankingGlobal} globally`}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className="border-white/30 bg-white/10 text-white">
                    {university.type === "PUBLIC" ? "Public" : "Private"}
                  </Badge>
                  {university.scholarshipsAvailable && <Badge variant="accent">Scholarships available</Badge>}
                  <Badge className="border-white/30 bg-white/10 text-white">{university.programs.length} programs</Badge>
                  {university.isFeatured && <FeaturedBadge />}
                  <AdmissionStatusBadge status={university.admissionStatus} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FavoriteButton
                entityType="UNIVERSITY"
                entityId={university.id}
                initialFavorited={favoritedIds.has(university.id)}
                locale={locale}
                size="default"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              />
              <CompareButton kind="universities" slug={university.slug} className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
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

          {university.gallery.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Campus Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {university.gallery.map((g) => (
                  <div key={g.id} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <Image src={g.imageUrl} alt={g.caption ?? t.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <Tabs defaultValue="programs">
            <TabsList>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              {university.scholarships.length > 0 && <TabsTrigger value="scholarships">Scholarships</TabsTrigger>}
              {university.rankings.length > 0 && <TabsTrigger value="rankings">Rankings</TabsTrigger>}
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
                        id: p.id,
                        slug: p.slug,
                        name: p.translation.name,
                        universityName: t.name,
                        degreeLevel: p.degreeLevel,
                        studyLanguage: p.studyLanguage,
                        durationMonths: p.durationMonths,
                        tuitionMinor: p.fees[0]?.tuitionMinor ?? null,
                        currency: p.currency,
                        featured: p.featured,
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
              {university.intakes.length > 0 && (
                <div>
                  <h3 className="font-display text-base font-semibold">Intake Windows</h3>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {university.intakes.map((intake) => (
                      <Card key={intake.id}>
                        <CardContent className="space-y-1 pt-6">
                          <p className="text-sm font-semibold">{intake.label}</p>
                          <DeadlineDisplay date={intake.applicationDeadline} locale={locale} />
                          <AdmissionStatusBadge status={intake.status} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {university.scholarships.length > 0 && (
              <TabsContent value="scholarships">
                <div className="grid gap-6 sm:grid-cols-2">
                  {university.scholarships.map((s) => (
                    <ScholarshipCard
                      key={s.slug}
                      locale={locale}
                      scholarship={{
                        id: s.id,
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

            {university.rankings.length > 0 && (
              <TabsContent value="rankings">
                <ul className="space-y-2">
                  {university.rankings.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                      <Trophy className="h-4 w-4 shrink-0 text-secondary" />
                      <span className="font-medium">#{r.rank}</span>
                      <span className="text-muted-foreground">
                        {r.source} · {r.rankType} · {r.year}
                      </span>
                    </li>
                  ))}
                </ul>
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

          {(university.accreditationRecords.length > 0 || university.accreditations.length > 0) && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Accreditations</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {university.accreditationRecords.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="flex items-center gap-3 pt-6">
                      <BadgeCheck className="h-5 w-5 shrink-0 text-secondary" />
                      <div>
                        <p className="text-sm font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.issuingBody}
                          {a.year ? ` · ${a.year}` : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-4">
                {faqs.map((f) => (
                  <div key={f.id}>
                    <p className="font-medium">{f.translation.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{f.translation.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {university.articles.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-primary">Related Articles</h2>
              <ul className="mt-4 space-y-2">
                {university.articles.map((a) => (
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
                <p className="text-xs text-muted-foreground">Starting tuition</p>
                <PriceDisplay amountMinor={university.startingTuitionMinor} currency={university.currency} locale={locale} size="lg" suffix="/year" />
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
