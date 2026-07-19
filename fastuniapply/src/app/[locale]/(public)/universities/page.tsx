import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listUniversities, listUniversityFilterOptions } from "@/server/repositories/university.repository";
import { UniversityCard } from "@/components/catalog/university-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import type { UniversityType, AdmissionStatus } from "@prisma/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("universities"),
    description: "Search and compare partner universities across 11 study destinations — filter by country, type, ranking, and scholarship availability.",
  };
}

interface SearchParams {
  country?: string;
  type?: string;
  admission?: string;
  scholarships?: string;
  page?: string;
}

export default async function UniversitiesPage({
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
  const { universities, total, totalPages } = await listUniversities(
    {
      countrySlug: clean(searchParams.country),
      type: clean(searchParams.type) as UniversityType | undefined,
      admissionStatus: clean(searchParams.admission) as AdmissionStatus | undefined,
      scholarshipsAvailable: searchParams.scholarships === "true" ? true : undefined,
      page,
    },
    locale,
  );
  const { countries } = await listUniversityFilterOptions();

  const buildHref = (overrides: Partial<SearchParams>) => {
    const params = new URLSearchParams({
      ...(searchParams.country && { country: searchParams.country }),
      ...(searchParams.type && { type: searchParams.type }),
      ...(searchParams.admission && { admission: searchParams.admission }),
      ...(searchParams.scholarships && { scholarships: searchParams.scholarships }),
      ...overrides,
    });
    for (const [key, value] of Array.from(params.entries())) {
      if (!value) params.delete(key);
    }
    const qs = params.toString();
    return `/${locale}/universities${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">{t("universities")}</h1>
        <p className="mt-2 text-muted-foreground">{total} universities across {countries.length} countries</p>
      </div>

      <form action={`/${locale}/universities`} className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect name="country" label="Country" defaultValue={searchParams.country} options={countries.map((c) => ({ value: c.slug, label: c.name }))} />
        <FilterSelect name="type" label="Type" defaultValue={searchParams.type} options={[{ value: "PUBLIC", label: "Public" }, { value: "PRIVATE", label: "Private" }]} />
        <FilterSelect name="admission" label="Admission" defaultValue={searchParams.admission} options={[{ value: "OPEN", label: "Open" }, { value: "UPCOMING", label: "Upcoming" }, { value: "CLOSED", label: "Closed" }]} />
        <FilterSelect name="scholarships" label="Scholarships" defaultValue={searchParams.scholarships} options={[{ value: "true", label: "Available" }]} />
        <div className="flex items-end lg:col-span-4">
          <Button type="submit" className="w-full sm:w-auto">
            Apply Filters
          </Button>
        </div>
      </form>

      {universities.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No universities match these filters"
          description="Try broadening your search — remove a filter or explore all universities."
          action={{ label: "Clear filters", href: `/${locale}/universities` }}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => (
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
          <Pagination page={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: String(p) })} />
        </>
      )}
    </div>
  );
}

function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select name={name} defaultValue={defaultValue || "all"}>
        <SelectTrigger>
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
