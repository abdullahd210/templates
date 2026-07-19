import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getArticleBySlug, listRelatedArticles } from "@/server/repositories/article.repository";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { Clock, Calendar, User } from "lucide-react";

export async function generateMetadata({
  params: { locale, articleSlug },
}: {
  params: { locale: AppLocale; articleSlug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(articleSlug, locale);
  if (!article) return {};
  return {
    title: article.translation.title,
    description: article.translation.excerpt ?? undefined,
    alternates: { canonical: `/${locale}/articles/${articleSlug}` },
    openGraph: { images: article.featuredImageUrl ? [article.featuredImageUrl] : undefined },
  };
}

export default async function ArticleDetailPage({
  params: { locale, articleSlug },
}: {
  params: { locale: AppLocale; articleSlug: string };
}) {
  setRequestLocale(locale);
  const article = await getArticleBySlug(articleSlug, locale);
  if (!article) notFound();

  const t = article.translation;
  const related = await listRelatedArticles(article.id, article.categoryId, locale, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.title,
    description: t.excerpt ?? undefined,
    author: article.author.name ? { "@type": "Person", name: article.author.name } : undefined,
    datePublished: article.publishedAt?.toISOString(),
  };

  return (
    <article className="container max-w-3xl py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href={`/${locale}/articles`} className="hover:underline">
          Articles
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/articles/category/${article.category.key}`} className="hover:underline">
          {article.category.name}
        </Link>
      </nav>

      <Badge variant="secondary">{article.category.name}</Badge>
      <h1 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{t.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {article.author.name && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {article.author.name}
          </span>
        )}
        {article.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatDate(article.publishedAt, locale)}
          </span>
        )}
        {article.readingTimeMinutes && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {article.readingTimeMinutes} min read
          </span>
        )}
      </div>

      {/* eslint-disable-next-line react/no-danger */}
      <div
        className="prose prose-slate mt-8 max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: t.contentHtml }}
      />

      {(article.relatedUniversities.length > 0 || article.relatedPrograms.length > 0 || article.relatedScholarships.length > 0) && (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {article.relatedUniversities.length > 0 && (
            <RelatedList
              title="Related Universities"
              items={article.relatedUniversities.map((u) => ({
                href: `/${locale}/universities/${u.slug}`,
                label: u.translations.find((tr) => tr.locale === locale)?.name ?? u.translations[0]?.name ?? u.slug,
              }))}
            />
          )}
          {article.relatedPrograms.length > 0 && (
            <RelatedList
              title="Related Programs"
              items={article.relatedPrograms.map((p) => ({
                href: `/${locale}/programs/${p.slug}`,
                label: p.translations.find((tr) => tr.locale === locale)?.name ?? p.translations[0]?.name ?? p.slug,
              }))}
            />
          )}
          {article.relatedScholarships.length > 0 && (
            <RelatedList
              title="Related Scholarships"
              items={article.relatedScholarships.map((s) => ({
                href: `/${locale}/scholarships/${s.slug}`,
                label: s.translations.find((tr) => tr.locale === locale)?.title ?? s.translations[0]?.title ?? s.slug,
              }))}
            />
          )}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-bold text-primary">Related Articles</h2>
          <ul className="mt-4 space-y-3">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={`/${locale}/articles/${a.slug}`} className="font-medium text-primary hover:underline">
                  {a.translation.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function RelatedList({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-primary hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
