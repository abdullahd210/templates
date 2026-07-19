import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { locales } from "@/i18n/config";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function localizedEntries(path: string): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: new Date(),
  }));
}

const legalDocs = [
  "privacy-policy",
  "terms-and-conditions",
  "cookie-policy",
  "refund-policy",
  "application-service-agreement",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/universities",
    "/programs",
    "/programs/compare",
    "/scholarships",
    "/study-in",
    "/articles",
    "/consultation",
    "/contact",
    "/faq",
    "/success-stories",
    "/partnerships/become-a-partner",
    "/partnerships/become-an-agent",
    "/careers",
    "/search",
    ...legalDocs.map((doc) => `/legal/${doc}`),
  ];
  const staticEntries = staticPaths.flatMap((path) => localizedEntries(path));

  const [universities, programs, scholarships, articles, countries, articleCategories] = await Promise.all([
    db.university.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
    db.program.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
    db.scholarship.findMany({ where: { deletedAt: null, visible: true }, select: { slug: true, updatedAt: true } }),
    db.article.findMany({ where: { deletedAt: null, published: true }, select: { slug: true, updatedAt: true } }),
    db.country.findMany({ where: { deletedAt: null, countryGuide: { published: true } }, select: { slug: true } }),
    db.articleCategory.findMany({ select: { key: true } }),
  ]).catch(() => [[], [], [], [], [], []] as const);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...universities.flatMap((u) => localizedEntries(`/universities/${u.slug}`)),
    ...programs.flatMap((p) => localizedEntries(`/programs/${p.slug}`)),
    ...scholarships.flatMap((s) => localizedEntries(`/scholarships/${s.slug}`)),
    ...articles.flatMap((a) => localizedEntries(`/articles/${a.slug}`)),
    ...countries.flatMap((c) => localizedEntries(`/study-in/${c.slug}`)),
    ...articleCategories.flatMap((c) => localizedEntries(`/articles/category/${c.key}`)),
  ];

  return [...staticEntries, ...dynamicEntries];
}
