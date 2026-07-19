import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listScholarships } from "@/server/repositories/scholarship.repository";
import { listUniversityFilterOptions } from "@/server/repositories/university.repository";
import { ScholarshipCard } from "@/components/catalog/scholarship-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import type { ScholarshipCoverageType } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("scholarships"),
    description: "Find full and partial scholarships from partner universities across 11 study destinations.",
  };
}

interface SearchParams {
  country?: string;
  coverage?: string;
  page?: string;
}

export default async function ScholarshipsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: SearchParams;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const clean = (v: string | undefined) => (v && v !== "all" ? v : undefined);

  const page = Number(searchParams.page ?? "1") || 1;
  const { scholarships, total, totalPages } = await listScholarships(
    {
      countrySlug: clean(searchParams.country),
      coverageType: clean(searchParams.coverage) as ScholarshipCoverageType | undefined,
      page,
    },
    locale,
  );
  const { countries } = await listUniversityFilterOptions();

  const buildHref = (overrides: Partial<SearchParams>) => {
    const params = new URLSearchParams({
      ...(searchParams.country && { country: searchParams.country }),
      ...(searchParams.coverage && { coverage: searchParams.coverage }),
      ...overrides,
    });
    for (const [key, value] of Array.from(params.entries())) {
      if (!value) params.delete(key);
    }
    const qs = params.toString();
    return `/${locale}/scholarships${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("scholarships")}</h1>
        <p className="mt-2 text-muted-foreground">{total} scholarships available</p>
      </div>

      <form action={`/${locale}/scholarships`} className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Country</label>
          <Select name="country" defaultValue={searchParams.country || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Coverage</label>
          <Select name="coverage" defaultValue={searchParams.coverage || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="FULL">Full</SelectItem>
              <SelectItem value="PARTIAL">Partial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </div>
      </form>

      {scholarships.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No scholarships match these filters"
          description="Try broadening your search — remove a filter or explore all scholarships."
          action={{ label: "Clear filters", href: `/${locale}/scholarships` }}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
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
          <Pagination page={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: String(p) })} />
        </>
      )}
    </div>
  );
}
