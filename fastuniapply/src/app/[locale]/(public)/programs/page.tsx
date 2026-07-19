import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { listPrograms, listProgramFilterOptions } from "@/server/repositories/program.repository";
import { listUniversityFilterOptions, listUniversitiesForSelect } from "@/server/repositories/university.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { parseProgramQuery, type ProgramQuery } from "@/validation/program-query.schema";
import { sortOptions } from "@/validation/query.schema";
import { ProgramCard, degreeLevelLabel } from "@/components/catalog/program-card";
import { ProgramFilterForm } from "@/components/catalog/program-filter-form";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SortSelect } from "@/components/shared/sort-select";
import { FilterChips, type FilterChip } from "@/components/shared/filter-chips";
import { MobileFilterDrawer } from "@/components/shared/mobile-filter-drawer";
import { BookOpen } from "lucide-react";
import type { DegreeLevel } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("programs"),
    description: "Search academic programs from Foundation to PhD across our partner universities — filter by degree level, field, language, and tuition.",
    alternates: { canonical: `/${locale}/programs` },
  };
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function ProgramsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: RawSearchParams;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const query = parseProgramQuery(searchParams);

  const session = await auth();
  const [{ programs, total, totalPages, page }, { fields, languages }, { countries }, universities, favoritedIds] = await Promise.all([
    listPrograms(query, locale),
    listProgramFilterOptions(),
    listUniversityFilterOptions(),
    listUniversitiesForSelect(locale),
    getFavoritedEntityIds(session, "PROGRAM"),
  ]);

  const buildHref = (overrides: Partial<Record<keyof ProgramQuery, string | undefined>>) => {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      q: query.q,
      country: query.country,
      university: query.university,
      degreeLevel: query.degreeLevel,
      field: query.field,
      major: query.major,
      studyLanguage: query.studyLanguage,
      minTuition: query.minTuition ? String(query.minTuition / 100) : undefined,
      maxTuition: query.maxTuition ? String(query.maxTuition / 100) : undefined,
      maxDuration: query.maxDuration ? String(query.maxDuration) : undefined,
      scholarships: query.scholarships ? "true" : undefined,
      admission: query.admission,
      featured: query.featured ? "true" : undefined,
      sort: query.sort !== "relevance" ? query.sort : undefined,
      ...overrides,
    };
    for (const [key, value] of Object.entries(current)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return `/${locale}/programs${qs ? `?${qs}` : ""}`;
  };

  const chips: FilterChip[] = [
    query.q && { key: "q", label: `"${query.q}"`, removeHref: buildHref({ q: undefined }) },
    query.country && {
      key: "country",
      label: countries.find((c) => c.slug === query.country)?.name ?? query.country,
      removeHref: buildHref({ country: undefined }),
    },
    query.university && {
      key: "university",
      label: universities.find((u) => u.slug === query.university)?.name ?? query.university,
      removeHref: buildHref({ university: undefined }),
    },
    query.degreeLevel && {
      key: "degreeLevel",
      label: degreeLevelLabel[query.degreeLevel as DegreeLevel],
      removeHref: buildHref({ degreeLevel: undefined }),
    },
    query.field && { key: "field", label: query.field, removeHref: buildHref({ field: undefined }) },
    query.studyLanguage && { key: "studyLanguage", label: query.studyLanguage, removeHref: buildHref({ studyLanguage: undefined }) },
    query.minTuition !== undefined && { key: "minTuition", label: `Min $${query.minTuition / 100}`, removeHref: buildHref({ minTuition: undefined }) },
    query.maxTuition !== undefined && { key: "maxTuition", label: `Max $${query.maxTuition / 100}`, removeHref: buildHref({ maxTuition: undefined }) },
    query.maxDuration !== undefined && { key: "maxDuration", label: `≤ ${query.maxDuration} months`, removeHref: buildHref({ maxDuration: undefined }) },
    query.scholarships && { key: "scholarships", label: "Has scholarships", removeHref: buildHref({ scholarships: undefined }) },
    query.admission && { key: "admission", label: query.admission, removeHref: buildHref({ admission: undefined }) },
    query.featured && { key: "featured", label: "Featured", removeHref: buildHref({ featured: undefined }) },
  ].filter((c): c is FilterChip => Boolean(c));

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("programs")}</h1>
        <p className="mt-2 text-muted-foreground">{total} academic programs</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 rounded-xl border border-border bg-card p-4 lg:block">
          <ProgramFilterForm
            locale={locale}
            query={query}
            countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
            universities={universities.map((u) => ({ value: u.slug, label: u.name }))}
            fields={fields}
            studyLanguages={languages}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MobileFilterDrawer activeCount={chips.length}>
              <ProgramFilterForm
                locale={locale}
                query={query}
                countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
                universities={universities.map((u) => ({ value: u.slug, label: u.name }))}
                fields={fields}
                studyLanguages={languages}
              />
            </MobileFilterDrawer>
            <p className="text-sm text-muted-foreground">{total} results</p>
            <SortSelect options={sortOptions} />
          </div>

          <FilterChips chips={chips} clearAllHref={`/${locale}/programs`} />

          {programs.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No programs match these filters"
              description="Try broadening your search — remove a filter or explore all programs."
              action={{ label: "Clear filters", href: `/${locale}/programs` }}
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                      featured: p.featured,
                      isFavorited: favoritedIds.has(p.id),
                    }}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: String(p) })} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
