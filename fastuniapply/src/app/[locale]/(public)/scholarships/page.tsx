import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { listScholarships } from "@/server/repositories/scholarship.repository";
import { listUniversityFilterOptions, listUniversitiesForSelect } from "@/server/repositories/university.repository";
import { getFavoritedEntityIds } from "@/server/services/favorite.service";
import { parseScholarshipQuery, type ScholarshipQuery } from "@/validation/scholarship-query.schema";
import { sortOptions } from "@/validation/query.schema";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { ScholarshipFilterForm } from "@/components/catalog/scholarship-filter-form";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SortSelect } from "@/components/shared/sort-select";
import { FilterChips, type FilterChip } from "@/components/shared/filter-chips";
import { MobileFilterDrawer } from "@/components/shared/mobile-filter-drawer";
import { Award } from "lucide-react";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import type { DegreeLevel } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("scholarships"),
    description: "Find full and partial scholarships from partner universities across 11 study destinations.",
    alternates: { canonical: `/${locale}/scholarships` },
  };
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function ScholarshipsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: RawSearchParams;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const query = parseScholarshipQuery(searchParams);

  const session = await auth();
  const [{ scholarships, total, totalPages, page }, { countries }, universities, favoritedIds] = await Promise.all([
    listScholarships(query, locale),
    listUniversityFilterOptions(),
    listUniversitiesForSelect(locale),
    getFavoritedEntityIds(session, "SCHOLARSHIP"),
  ]);

  const buildHref = (overrides: Partial<Record<keyof ScholarshipQuery, string | undefined>>) => {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      q: query.q,
      country: query.country,
      university: query.university,
      coverageType: query.coverageType,
      degreeLevel: query.degreeLevel,
      nationality: query.nationality,
      status: query.status,
      sort: query.sort !== "relevance" ? query.sort : undefined,
      ...overrides,
    };
    for (const [key, value] of Object.entries(current)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return `/${locale}/scholarships${qs ? `?${qs}` : ""}`;
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
    query.coverageType && { key: "coverageType", label: query.coverageType === "FULL" ? "Full" : "Partial", removeHref: buildHref({ coverageType: undefined }) },
    query.degreeLevel && {
      key: "degreeLevel",
      label: degreeLevelLabel[query.degreeLevel as DegreeLevel],
      removeHref: buildHref({ degreeLevel: undefined }),
    },
    query.nationality && { key: "nationality", label: query.nationality, removeHref: buildHref({ nationality: undefined }) },
    query.status && { key: "status", label: query.status === "active" ? "Active" : "Expired", removeHref: buildHref({ status: undefined }) },
  ].filter((c): c is FilterChip => Boolean(c));

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("scholarships")}</h1>
        <p className="mt-2 text-muted-foreground">{total} scholarships available</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 rounded-xl border border-border bg-card p-4 lg:block">
          <ScholarshipFilterForm
            locale={locale}
            query={query}
            countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
            universities={universities.map((u) => ({ value: u.slug, label: u.name }))}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MobileFilterDrawer activeCount={chips.length}>
              <ScholarshipFilterForm
                locale={locale}
                query={query}
                countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
                universities={universities.map((u) => ({ value: u.slug, label: u.name }))}
              />
            </MobileFilterDrawer>
            <p className="text-sm text-muted-foreground">{total} results</p>
            <SortSelect options={sortOptions} />
          </div>

          <FilterChips chips={chips} clearAllHref={`/${locale}/scholarships`} />

          {scholarships.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No scholarships match these filters"
              description="Try broadening your search — remove a filter or explore all scholarships."
              action={{ label: "Clear filters", href: `/${locale}/scholarships` }}
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {scholarships.map((s) => (
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
                      isFavorited: favoritedIds.has(s.id),
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
