import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getProgramsBySlugsForComparison } from "@/server/repositories/program.repository";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatMoney, formatDate } from "@/lib/format";
import { Scale } from "lucide-react";

export const metadata: Metadata = { title: "Compare Programs" };

interface Row {
  label: string;
  render: (p: Awaited<ReturnType<typeof getProgramsBySlugsForComparison>>[number], locale: AppLocale) => React.ReactNode;
}

const rows: Row[] = [
  { label: "University", render: (p) => p.university.translation.name },
  { label: "Country", render: (p) => p.university.country.name },
  { label: "Degree Level", render: (p) => degreeLevelLabel[p.degreeLevel] },
  { label: "Duration", render: (p) => `${p.durationMonths} months` },
  { label: "Study Language", render: (p) => p.studyLanguage },
  {
    label: "Tuition",
    render: (p, locale) => (p.fees[0] ? formatMoney(p.fees[0].tuitionMinor, p.fees[0].currency, locale) : "—"),
  },
  {
    label: "Application Fee",
    render: (p, locale) => (p.applicationFeeMinor > 0 ? formatMoney(p.applicationFeeMinor, p.currency, locale) : "Free"),
  },
  {
    label: "Next Deadline",
    render: (p, locale) => {
      const next = [...p.intakes].sort((a, b) => a.applicationDeadline.getTime() - b.applicationDeadline.getTime())[0];
      return next ? formatDate(next.applicationDeadline, locale) : "—";
    },
  },
];

export default async function ProgramComparePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: { programs?: string };
}) {
  setRequestLocale(locale);
  const slugs = (searchParams.programs ?? "").split(",").filter(Boolean).slice(0, 4);
  const programs = slugs.length > 0 ? await getProgramsBySlugsForComparison(slugs, locale) : [];

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-primary">Compare Programs</h1>
      <p className="mt-2 text-muted-foreground">Compare up to 4 programs side by side.</p>

      {programs.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Scale}
          title="No programs selected"
          description="Browse the program directory and open this page with ?programs=slug-one,slug-two to compare."
          action={{ label: "Browse Programs", href: `/${locale}/programs` }}
        />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-4 text-start font-medium text-muted-foreground">&nbsp;</th>
                {programs.map((p) => (
                  <th key={p.slug} className="p-4 text-start">
                    <Link href={`/${locale}/programs/${p.slug}`} className="font-display font-semibold text-primary hover:underline">
                      {p.translation.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                  {programs.map((p) => (
                    <td key={p.slug} className="p-4">
                      {row.render(p, locale)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
