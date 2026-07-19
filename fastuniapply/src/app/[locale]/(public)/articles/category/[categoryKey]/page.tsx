import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listArticles, listArticleCategories } from "@/server/repositories/article.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { formatDate } from "@/lib/format";
import { Clock } from "lucide-react";

export async function generateMetadata({
  params: { categoryKey },
}: {
  params: { categoryKey: string };
}): Promise<Metadata> {
  const categories = await listArticleCategories();
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return {};
  return { title: category.name };
}

export default async function ArticleCategoryPage({
  params: { locale, categoryKey },
  searchParams,
}: {
  params: { locale: AppLocale; categoryKey: string };
  searchParams: { page?: string };
}) {
  setRequestLocale(locale);
  const categories = await listArticleCategories();
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) notFound();

  const page = Number(searchParams.page ?? "1") || 1;
  const { articles, total, totalPages } = await listArticles({ categoryKey, page }, locale);

  return (
    <div className="container py-12">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href={`/${locale}/articles`} className="hover:underline">
          Articles
        </Link>{" "}
        / {category.name}
      </nav>
      <h1 className="font-display text-3xl font-bold text-primary">{category.name}</h1>
      <p className="mt-2 text-muted-foreground">{total} articles</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.slug} href={`/${locale}/articles/${a.slug}`}>
            <Card className="flex h-full flex-col transition-shadow hover:shadow-elevated">
              <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                <p className="font-display text-base font-semibold leading-snug">{a.translation.title}</p>
                {a.translation.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.translation.excerpt}</p>
                )}
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                  {a.publishedAt && <span>{formatDate(a.publishedAt, locale)}</span>}
                  {a.readingTimeMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.readingTimeMinutes} min read
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/${locale}/articles/category/${categoryKey}${p > 1 ? `?page=${p}` : ""}`}
      />
    </div>
  );
}
