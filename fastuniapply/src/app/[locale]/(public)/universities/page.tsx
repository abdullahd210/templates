import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { listUniversities, listUniversityFilterOptions } from "@/server/repositories/university.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { parseUniversityQuery, type UniversityQuery } from "@/validation/university-query.schema";
import { sortOptions } from "@/validation/query.schema";
import { UniversityCard } from "@/components/catalog/university-card";
import { UniversityFilterForm } from "@/components/catalog/university-filter-form";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SortSelect } from "@/components/shared/sort-select";
import { FilterChips, type FilterChip } from "@/components/shared/filter-chips";
import { MobileFilterDrawer } from "@/components/shared/mobile-filter-drawer";
import { GraduationCap } from "lucide-react";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import type { DegreeLevel } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("universities"),
    description:
      "Search and compare partner universities across 11 study destinations — filter by country, city, type, degree level, tuition, and scholarship availability.",
    alternates: { canonical: `/${locale}/universities` },
  };
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function UniversitiesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: RawSearchParams;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const query = parseUniversityQuery(searchParams);

  const session = await auth();
  const [{ universities, total, totalPages, page }, { countries, cities, studyLanguages }, favoritedIds] = await Promise.all([
    listUniversities(query, locale),
    listUniversityFilterOptions(),
    getFavoritedEntityIds(session, "UNIVERSITY"),
  ]);

  const buildHref = (overrides: Partial<Record<keyof UniversityQuery, string | undefined>>) => {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      q: query.q,
      country: query.country,
      city: query.city,
      type: query.type,
      degreeLevel: query.degreeLevel,
      studyLanguage: query.studyLanguage,
      minTuition: query.minTuition ? String(query.minTuition / 100) : undefined,
      maxTuition: query.maxTuition ? String(query.maxTuition / 100) : undefined,
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
    return `/${locale}/universities${qs ? `?${qs}` : ""}`;
  };

  const chips: FilterChip[] = [
    query.q && { key: "q", label: `"${query.q}"`, removeHref: buildHref({ q: undefined }) },
    query.country && {
      key: "country",
      label: countries.find((c) => c.slug === query.country)?.name ?? query.country,
      removeHref: buildHref({ country: undefined }),
    },
    query.city && {
      key: "city",
      label: cities.find((c) => c.slug === query.city)?.name ?? query.city,
      removeHref: buildHref({ city: undefined }),
    },
    query.type && { key: "type", label: query.type === "PUBLIC" ? "Public" : "Private", removeHref: buildHref({ type: undefined }) },
    query.degreeLevel && {
      key: "degreeLevel",
      label: degreeLevelLabel[query.degreeLevel as DegreeLevel],
      removeHref: buildHref({ degreeLevel: undefined }),
    },
    query.studyLanguage && { key: "studyLanguage", label: query.studyLanguage, removeHref: buildHref({ studyLanguage: undefined }) },
    query.minTuition !== undefined && { key: "minTuition", label: `Min $${query.minTuition / 100}`, removeHref: buildHref({ minTuition: undefined }) },
    query.maxTuition !== undefined && { key: "maxTuition", label: `Max $${query.maxTuition / 100}`, removeHref: buildHref({ maxTuition: undefined }) },
    query.scholarships && { key: "scholarships", label: "Scholarships available", removeHref: buildHref({ scholarships: undefined }) },
    query.admission && { key: "admission", label: query.admission, removeHref: buildHref({ admission: undefined }) },
    query.featured && { key: "featured", label: "Featured", removeHref: buildHref({ featured: undefined }) },
  ].filter((c): c is FilterChip => Boolean(c));

  const activeFilterCount = chips.length;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("universities")}</h1>
        <p className="mt-2 text-muted-foreground">
          {total} {total === 1 ? "university" : "universities"} across {countries.length} countries
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 rounded-xl border border-border bg-card p-4 lg:block">
          <UniversityFilterForm locale={locale} query={query} countries={countries.map((c) => ({ value: c.slug, label: c.name }))} cities={cities.filter((c) => c.slug).map((c) => ({ value: c.slug as string, label: c.name }))} studyLanguages={studyLanguages} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MobileFilterDrawer activeCount={activeFilterCount}>
              <UniversityFilterForm locale={locale} query={query} countries={countries.map((c) => ({ value: c.slug, label: c.name }))} cities={cities.filter((c) => c.slug).map((c) => ({ value: c.slug as string, label: c.name }))} studyLanguages={studyLanguages} />
            </MobileFilterDrawer>
            <p className="text-sm text-muted-foreground">{total} results</p>
            <SortSelect options={sortOptions} />
          </div>

          <FilterChips chips={chips} clearAllHref={`/${locale}/universities`} />

          {universities.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No universities match these filters"
              description="Try broadening your search — remove a filter or explore all universities."
              action={{ label: "Clear filters", href: `/${locale}/universities` }}
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                      isFeatured: u.isFeatured,
                      isFavorited: favoritedIds.has(u.id),
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
