import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";

export interface ArticleFilters {
  categoryKey?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function listArticles(filters: ArticleFilters, locale: AppLocale) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 9;

  const where = {
    deletedAt: null,
    published: true,
    ...(filters.categoryKey && { category: { key: filters.categoryKey } }),
    ...(filters.query && {
      translations: { some: { title: { contains: filters.query, mode: "insensitive" as const } } },
    }),
  };

  const [rows, total] = await Promise.all([
    db.article.findMany({
      where,
      include: { translations: true, category: true, author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.article.count({ where }),
  ]);

  const articles = rows.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) }));
  return { articles, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getArticleBySlug(slug: string, locale: AppLocale) {
  const article = await db.article.findFirst({
    where: { slug, deletedAt: null, published: true },
    include: {
      translations: true,
      category: true,
      author: true,
      relatedUniversities: { include: { translations: true } },
      relatedPrograms: { include: { translations: true, university: { include: { translations: true } } } },
      relatedScholarships: { include: { translations: true } },
    },
  });
  if (!article) return null;

  return { ...article, translation: pickTranslation(article.translations, locale) };
}

export async function listRelatedArticles(articleId: string, categoryId: string, locale: AppLocale, take = 3) {
  const rows = await db.article.findMany({
    where: { deletedAt: null, published: true, id: { not: articleId }, categoryId },
    include: { translations: true, category: true },
    take,
  });
  return rows.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) }));
}

export async function listLatestArticles(locale: AppLocale, take = 3) {
  const rows = await db.article.findMany({
    where: { deletedAt: null, published: true },
    include: { translations: true, category: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
  return rows.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) }));
}

export async function listArticleCategories() {
  return db.articleCategory.findMany({ orderBy: { name: "asc" } });
}
