import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getUniversitiesBySlugsForComparison } from "@/server/repositories/university.repository";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ComparisonTable, type ComparisonRow } from "@/components/shared/comparison-table";
import { formatMoney, formatDate } from "@/lib/format";
import { MAX_COMPARISON_ITEMS } from "@/validation/comparison.schema";
import { Scale } from "lucide-react";

export const metadata: Metadata = { title: "Compare Universities" };

type ComparableUniversity = Awaited<ReturnType<typeof getUniversitiesBySlugsForComparison>>[number];

const rows: ComparisonRow<ComparableUniversity>[] = [
  { label: "Country", render: (u) => u.country.name },
  { label: "City", render: (u) => u.campuses[0]?.city.name ?? "—" },
  { label: "Type", render: (u) => (u.type === "PUBLIC" ? "Public" : "Private") },
  { label: "Degree Levels", render: (u) => u.degreeLevels.map((d) => degreeLevelLabel[d]).join(", ") || "—" },
  { label: "Study Languages", render: (u) => u.studyLanguages.join(", ") || "—" },
  {
    label: "Starting Tuition",
    render: (u, locale) => (u.startingTuitionMinor ? formatMoney(u.startingTuitionMinor, u.currency, locale) : "Contact us"),
  },
  { label: "Scholarships Available", render: (u) => (u.scholarshipsAvailable ? "Yes" : "No") },
  { label: "Programs", render: (u) => u.programsCount },
  {
    label: "Global Ranking",
    render: (u) => (u.rankings[0] ? `#${u.rankings[0].rank} (${u.rankings[0].source})` : u.rankingGlobal ? `#${u.rankingGlobal}` : "—"),
  },
  { label: "Admission Status", render: (u) => u.admissionStatus },
  {
    label: "Next Intake Deadline",
    render: (u, locale) => (u.intakes[0] ? formatDate(u.intakes[0].applicationDeadline, locale) : "—"),
  },
  { label: "Admission Requirements", render: (u) => u.translation.admissionRequirements ?? "—" },
];

export default async function UniversityComparePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: { universities?: string };
}) {
  setRequestLocale(locale);
  const slugs = (searchParams.universities ?? "").split(",").filter(Boolean).slice(0, MAX_COMPARISON_ITEMS);
  const universities = slugs.length > 0 ? await getUniversitiesBySlugsForComparison(slugs, locale) : [];

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-primary">Compare Universities</h1>
      <p className="mt-2 text-muted-foreground">Compare up to {MAX_COMPARISON_ITEMS} universities side by side.</p>

      {universities.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Scale}
          title="No universities selected"
          description="Browse the university directory and open this page with ?universities=slug-one,slug-two to compare."
          action={{ label: "Browse Universities", href: `/${locale}/universities` }}
        />
      ) : (
        <div className="mt-8">
          <ComparisonTable
            items={universities}
            rows={rows}
            locale={locale}
            titleRender={(u) => u.translation.name}
            hrefBuilder={(u) => `/${locale}/universities/${u.slug}`}
          />
        </div>
      )}
    </div>
  );
}
