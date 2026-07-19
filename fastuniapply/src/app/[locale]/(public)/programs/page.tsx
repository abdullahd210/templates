import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listPrograms, listProgramFilterOptions } from "@/server/repositories/program.repository";
import { ProgramCard, degreeLevelLabel } from "@/components/catalog/program-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import type { DegreeLevel } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("programs"),
    description: "Search academic programs from Foundation to PhD across our partner universities — filter by degree level, field, and language.",
  };
}

interface SearchParams {
  degreeLevel?: string;
  field?: string;
  language?: string;
  page?: string;
}

export default async function ProgramsPage({
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
  const { programs, total, totalPages } = await listPrograms(
    {
      degreeLevel: clean(searchParams.degreeLevel) as DegreeLevel | undefined,
      field: clean(searchParams.field),
      studyLanguage: clean(searchParams.language),
      page,
    },
    locale,
  );
  const { fields, languages } = await listProgramFilterOptions();

  const buildHref = (overrides: Partial<SearchParams>) => {
    const params = new URLSearchParams({
      ...(searchParams.degreeLevel && { degreeLevel: searchParams.degreeLevel }),
      ...(searchParams.field && { field: searchParams.field }),
      ...(searchParams.language && { language: searchParams.language }),
      ...overrides,
    });
    for (const [key, value] of Array.from(params.entries())) {
      if (!value) params.delete(key);
    }
    const qs = params.toString();
    return `/${locale}/programs${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("programs")}</h1>
        <p className="mt-2 text-muted-foreground">{total} academic programs</p>
      </div>

      <form action={`/${locale}/programs`} className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Degree Level</label>
          <Select name="degreeLevel" defaultValue={searchParams.degreeLevel || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {(Object.keys(degreeLevelLabel) as DegreeLevel[]).map((d) => (
                <SelectItem key={d} value={d}>
                  {degreeLevelLabel[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Field</label>
          <Select name="field" defaultValue={searchParams.field || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {fields.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Study Language</label>
          <Select name="language" defaultValue={searchParams.language || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </div>
      </form>

      {programs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No programs match these filters"
          description="Try broadening your search — remove a filter or explore all programs."
          action={{ label: "Clear filters", href: `/${locale}/programs` }}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
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
          <Pagination page={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: String(p) })} />
        </>
      )}
    </div>
  );
}
