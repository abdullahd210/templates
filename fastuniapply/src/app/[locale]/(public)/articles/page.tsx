import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listArticles, listArticleCategories } from "@/server/repositories/article.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import { formatDate } from "@/lib/format";
import { Clock } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("articles"), description: "Guides and news on university admissions, scholarships, student visas, and study destinations." };
}

export default async function ArticlesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: { page?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const page = Number(searchParams.page ?? "1") || 1;
  const [{ articles, total, totalPages }, categories] = await Promise.all([
    listArticles({ page }, locale),
    listArticleCategories(),
  ]);

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-primary">{t("articles")}</h1>
      <p className="mt-2 text-muted-foreground">{total} guides and updates</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.key} href={`/${locale}/articles/category/${c.key}`}>
            <Badge variant="outline" className="hover:bg-muted">
              {c.name}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.slug} href={`/${locale}/articles/${a.slug}`}>
            <Card className="flex h-full flex-col transition-shadow hover:shadow-elevated">
              <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                <Badge variant="secondary" className="w-fit">
                  {a.category.name}
                </Badge>
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
        buildHref={(p) => `/${locale}/articles${p > 1 ? `?page=${p}` : ""}`}
      />
    </div>
  );
}
