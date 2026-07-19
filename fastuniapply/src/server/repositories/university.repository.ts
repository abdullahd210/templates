import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { Prisma } from "@prisma/client";
import type { UniversityQuery } from "@/validation/university-query.schema";

const PAGE_SIZE = 12;

function buildWhere(filters: UniversityQuery): Prisma.UniversityWhereInput {
  return {
    deletedAt: null,
    ...(filters.country && { country: { slug: filters.country } }),
    ...(filters.city && { campuses: { some: { city: { slug: filters.city } } } }),
    ...(filters.type && { type: filters.type }),
    ...(filters.scholarships !== undefined && filters.scholarships && { scholarshipsAvailable: true }),
    ...(filters.admission && { admissionStatus: filters.admission }),
    ...(filters.degreeLevel && { programs: { some: { degreeLevel: filters.degreeLevel, deletedAt: null } } }),
    ...(filters.studyLanguage && {
      programs: { some: { studyLanguage: { equals: filters.studyLanguage, mode: "insensitive" }, deletedAt: null } },
    }),
    ...(filters.featured !== undefined && filters.featured && { isFeatured: true }),
    ...((filters.minTuition !== undefined || filters.maxTuition !== undefined) && {
      startingTuitionMinor: {
        ...(filters.minTuition !== undefined && { gte: filters.minTuition }),
        ...(filters.maxTuition !== undefined && { lte: filters.maxTuition }),
      },
    }),
    ...(filters.q && {
      translations: { some: { name: { contains: filters.q, mode: "insensitive" } } },
    }),
  };
}

function buildOrderBy(sort: UniversityQuery["sort"]): Prisma.UniversityOrderByWithRelationInput[] {
  switch (sort) {
    case "tuition_asc":
      return [{ startingTuitionMinor: "asc" }];
    case "tuition_desc":
      return [{ startingTuitionMinor: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "deadline":
      return [{ admissionStatus: "asc" }, { createdAt: "desc" }];
    case "featured":
      return [{ isFeatured: "desc" }, { rankingGlobal: "asc" }];
    case "relevance":
    default:
      return [{ isFeatured: "desc" }, { rankingGlobal: "asc" }];
  }
}

export async function listUniversities(filters: UniversityQuery, locale: AppLocale, pageSize = PAGE_SIZE) {
  const page = filters.page ?? 1;
  const where = buildWhere(filters);

  // Sorting by translated name can't be expressed as a Prisma orderBy on a
  // relation table directly, so it's applied in-memory after the page is
  // fetched (safe: only used for the current page's small result set is NOT
  // correct for pagination — so for name_asc we sort the full ID set first).
  if (filters.sort === "name_asc") {
    const all = await db.university.findMany({
      where,
      select: { id: true, translations: { where: { locale } } },
    });
    const ids = all
      .map((u) => ({ id: u.id, name: u.translations[0]?.name ?? "" }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * pageSize, page * pageSize)
      .map((u) => u.id);
    const total = all.length;
    const rows = await db.university.findMany({
      where: { id: { in: ids } },
      include: { country: true, translations: true, _count: { select: { programs: { where: { deletedAt: null } } } } },
    });
    const bySlugOrder = new Map(ids.map((id, index) => [id, index]));
    rows.sort((a, b) => (bySlugOrder.get(a.id) ?? 0) - (bySlugOrder.get(b.id) ?? 0));
    const universities = rows.map((u) => ({
      ...u,
      translation: pickTranslation(u.translations, locale),
      programsCount: u._count.programs,
    }));
    return { universities, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  const [rows, total] = await Promise.all([
    db.university.findMany({
      where,
      include: {
        country: true,
        translations: true,
        _count: { select: { programs: { where: { deletedAt: null } } } },
      },
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.university.count({ where }),
  ]);

  const universities = rows.map((u) => ({
    ...u,
    translation: pickTranslation(u.translations, locale),
    programsCount: u._count.programs,
  }));

  return { universities, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getUniversityBySlug(slug: string, locale: AppLocale) {
  const university = await db.university.findFirst({
    where: { slug, deletedAt: null },
    include: {
      country: true,
      translations: true,
      campuses: { include: { city: true } },
      programs: {
        where: { deletedAt: null },
        include: { translations: true, fees: true, intakes: true },
        orderBy: { featured: "desc" },
      },
      scholarships: { where: { deletedAt: null, visible: true }, include: { translations: true } },
      testimonials: { where: { featured: true }, take: 6 },
      rankings: { orderBy: [{ year: "desc" }, { rank: "asc" }] },
      accreditationRecords: { orderBy: { year: "desc" } },
      gallery: { orderBy: { sortOrder: "asc" } },
      intakes: { orderBy: { applicationDeadline: "asc" } },
      articles: { where: { published: true, deletedAt: null }, include: { translations: true }, take: 3 },
    },
  });
  if (!university) return null;

  return {
    ...university,
    translation: pickTranslation(university.translations, locale),
    programs: university.programs.map((p) => ({ ...p, translation: pickTranslation(p.translations, locale) })),
    scholarships: university.scholarships.map((s) => ({
      ...s,
      translation: pickTranslation(s.translations, locale),
    })),
    articles: university.articles.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) })),
  };
}

export async function listFeaturedUniversities(locale: AppLocale, take = 4) {
  const rows = await db.university.findMany({
    where: { deletedAt: null, isFeatured: true },
    include: { country: true, translations: true, _count: { select: { programs: true } } },
    orderBy: { rankingGlobal: "asc" },
    take,
  });
  return rows.map((u) => ({
    ...u,
    translation: pickTranslation(u.translations, locale),
    programsCount: u._count.programs,
  }));
}

export async function getUniversitiesBySlugsForComparison(slugs: string[], locale: AppLocale) {
  const rows = await db.university.findMany({
    where: { slug: { in: slugs }, deletedAt: null },
    include: {
      country: true,
      translations: true,
      campuses: { include: { city: true }, take: 1 },
      programs: { where: { deletedAt: null }, select: { degreeLevel: true, studyLanguage: true } },
      _count: { select: { programs: { where: { deletedAt: null } } } },
      rankings: { orderBy: [{ year: "desc" }, { rank: "asc" }], take: 1 },
      intakes: { orderBy: { applicationDeadline: "asc" }, take: 1 },
    },
  });
  const bySlug = new Map(rows.map((u) => [u.slug, u]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((u): u is NonNullable<typeof u> => Boolean(u))
    .map((u) => ({
      ...u,
      translation: pickTranslation(u.translations, locale),
      programsCount: u._count.programs,
      degreeLevels: Array.from(new Set(u.programs.map((p) => p.degreeLevel))),
      studyLanguages: Array.from(new Set(u.programs.map((p) => p.studyLanguage))),
    }));
}

export async function listUniversityFilterOptions() {
  const countries = await db.country.findMany({
    where: { deletedAt: null, universities: { some: { deletedAt: null } } },
    orderBy: { name: "asc" },
  });
  const cities = await db.city.findMany({
    where: { slug: { not: null }, campuses: { some: { university: { deletedAt: null } } } },
    orderBy: { name: "asc" },
  });
  const languages = await db.program.findMany({
    where: { deletedAt: null },
    select: { studyLanguage: true },
    distinct: ["studyLanguage"],
    orderBy: { studyLanguage: "asc" },
  });
  return { countries, cities, studyLanguages: languages.map((l) => l.studyLanguage) };
}

/** Slug/name pairs for university <select> dropdowns (program/scholarship filter forms), in the given locale. */
export async function listUniversitiesForSelect(locale: AppLocale) {
  const rows = await db.university.findMany({
    where: { deletedAt: null },
    select: { slug: true, translations: { where: { locale } } },
    orderBy: { slug: "asc" },
  });
  return rows
    .map((u) => ({ slug: u.slug, name: u.translations[0]?.name ?? u.slug }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
