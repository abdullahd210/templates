import Link from "next/link";
import type { AppLocale } from "@/i18n/config";

export interface ComparisonRow<T> {
  label: string;
  render: (item: T, locale: AppLocale) => React.ReactNode;
}

/**
 * Renders a side-by-side comparison two ways from one data set: a scrollable
 * table on desktop, and a stack of one card per item (each field as a
 * key/value row) below the `md` breakpoint, where a wide table would force
 * horizontal scrolling on every row instead of just the page.
 */
export function ComparisonTable<T extends { slug: string }>({
  items,
  rows,
  locale,
  titleRender,
  hrefBuilder,
}: {
  items: T[];
  rows: ComparisonRow<T>[];
  locale: AppLocale;
  titleRender: (item: T) => React.ReactNode;
  hrefBuilder: (item: T) => string;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 text-start font-medium text-muted-foreground">&nbsp;</th>
              {items.map((item) => (
                <th key={item.slug} className="p-4 text-start">
                  <Link href={hrefBuilder(item)} className="font-display font-semibold text-primary hover:underline">
                    {titleRender(item)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                {items.map((item) => (
                  <td key={item.slug} className="p-4">
                    {row.render(item, locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {items.map((item) => (
          <div key={item.slug} className="rounded-xl border border-border bg-card p-4">
            <Link href={hrefBuilder(item)} className="font-display font-semibold text-primary hover:underline">
              {titleRender(item)}
            </Link>
            <dl className="mt-3 divide-y divide-border">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="text-end font-medium">{row.render(item, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
