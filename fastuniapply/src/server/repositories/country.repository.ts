import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";

export async function listDestinationCountries() {
  return db.country.findMany({
    where: { deletedAt: null, countryGuide: { published: true } },
    include: { countryGuide: true, _count: { select: { universities: { where: { deletedAt: null } } } } },
    orderBy: { name: "asc" },
  });
}

export async function getCountryGuideBySlug(slug: string, locale: AppLocale) {
  const country = await db.country.findFirst({
    where: { slug, deletedAt: null },
    include: {
      countryGuide: { include: { translations: true } },
      universities: {
        where: { deletedAt: null },
        include: { translations: true, _count: { select: { programs: true } } },
        orderBy: { rankingGlobal: "asc" },
        take: 6,
      },
      scholarships: {
        where: { deletedAt: null, visible: true },
        include: { translations: true },
        take: 4,
      },
    },
  });
  if (!country || !country.countryGuide) return null;

  return {
    ...country,
    guideTranslation: pickTranslation(country.countryGuide.translations, locale),
    universities: country.universities.map((u) => ({
      ...u,
      translation: pickTranslation(u.translations, locale),
      programsCount: u._count.programs,
    })),
    scholarships: country.scholarships.map((s) => ({ ...s, translation: pickTranslation(s.translations, locale) })),
  };
}

export async function listAllCountries() {
  return db.country.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
}
