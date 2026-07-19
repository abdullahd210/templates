import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listUniversities } from "@/server/repositories/university.repository";
import { listPrograms } from "@/server/repositories/program.repository";
import { listScholarships } from "@/server/repositories/scholarship.repository";
import { listArticles } from "@/server/repositories/article.repository";
import { UniversityCard } from "@/components/catalog/university-card";
import { ProgramCard } from "@/components/catalog/program-card";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: { q?: string };
}) {
  setRequestLocale(locale);
  const q = (searchParams.q ?? "").trim();

  const [universities, programs, scholarships, articles] = q
    ? await Promise.all([
        listUniversities({ query: q, pageSize: 6 }, locale),
        listPrograms({ query: q, pageSize: 6 }, locale),
        listScholarships({ query: q, pageSize: 6 }, locale),
        listArticles({ query: q, pageSize: 6 }, locale),
      ])
    : [null, null, null, null];

  const totalResults =
    (universities?.total ?? 0) + (programs?.total ?? 0) + (scholarships?.total ?? 0) + (articles?.total ?? 0);

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-primary">Search</h1>
      <form action={`/${locale}/search`} className="mt-6 flex max-w-xl gap-2">
        <Input name="q" defaultValue={q} placeholder="Search universities, programs, scholarships, articles…" />
        <Button type="submit">
          <SearchIcon className="h-4 w-4" /> Search
        </Button>
      </form>

      {!q ? (
        <p className="mt-8 text-muted-foreground">Enter a keyword above to search across the whole platform.</p>
      ) : totalResults === 0 ? (
        <EmptyState
          className="mt-8"
          icon={SearchIcon}
          title={`No results for "${q}"`}
          description="Try a different keyword, or browse the directories directly."
        />
      ) : (
        <div className="mt-10 space-y-12">
          {universities && universities.universities.length > 0 && (
            <ResultSection title="Universities" count={universities.total} href={`/${locale}/universities?query=${q}`}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {universities.universities.map((u) => (
                  <UniversityCard
                    key={u.slug}
                    locale={locale}
                    university={{
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
            </ResultSection>
          )}

          {programs && programs.programs.length > 0 && (
            <ResultSection title="Programs" count={programs.total} href={`/${locale}/programs`}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programs.programs.map((p) => (
                  <ProgramCard
                    key={p.slug}
                    locale={locale}
                    program={{
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
            </ResultSection>
          )}

          {scholarships && scholarships.scholarships.length > 0 && (
            <ResultSection title="Scholarships" count={scholarships.total} href={`/${locale}/scholarships`}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scholarships.scholarships.map((s) => (
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
            </ResultSection>
          )}

          {articles && articles.articles.length > 0 && (
            <ResultSection title="Articles" count={articles.total} href={`/${locale}/articles`}>
              <ul className="space-y-2">
                {articles.articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/${locale}/articles/${a.slug}`} className="font-medium text-primary hover:underline">
                      {a.translation.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  count,
  href,
  children,
}: {
  title: string;
  count: number;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-primary">
          {title} <span className="text-sm font-normal text-muted-foreground">({count})</span>
        </h2>
        <Link href={href} className="text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      {children}
    </section>
  );
}
