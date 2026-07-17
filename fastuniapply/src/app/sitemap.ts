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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/universities", "/programs", "/scholarships", "/articles", "/contact", "/faq"];
  const staticEntries = staticPaths.flatMap((path) => localizedEntries(path));

  const [universities, programs, scholarships, articles] = await Promise.all([
    db.university.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
    db.program.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
    db.scholarship.findMany({ where: { deletedAt: null, visible: true }, select: { slug: true, updatedAt: true } }),
    db.article.findMany({ where: { deletedAt: null, published: true }, select: { slug: true, updatedAt: true } }),
  ]).catch(() => [[], [], [], []] as const);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...universities.flatMap((u) => localizedEntries(`/universities/${u.slug}`)),
    ...programs.flatMap((p) => localizedEntries(`/programs/${p.slug}`)),
    ...scholarships.flatMap((s) => localizedEntries(`/scholarships/${s.slug}`)),
    ...articles.flatMap((a) => localizedEntries(`/articles/${a.slug}`)),
  ];

  return [...staticEntries, ...dynamicEntries];
}
