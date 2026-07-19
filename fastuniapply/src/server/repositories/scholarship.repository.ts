import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { Prisma } from "@prisma/client";
import type { ScholarshipQuery } from "@/validation/scholarship-query.schema";

const PAGE_SIZE = 12;

function buildWhere(filters: ScholarshipQuery): Prisma.ScholarshipWhereInput {
  const now = new Date();
  return {
    deletedAt: null,
    visible: true,
    ...(filters.coverageType && { coverageType: filters.coverageType }),
    ...(filters.degreeLevel && { eligibleDegreeLevels: { has: filters.degreeLevel } }),
    ...(filters.nationality && { eligibleNationalities: { has: filters.nationality } }),
    ...(filters.country && { country: { slug: filters.country } }),
    ...(filters.university && { university: { slug: filters.university } }),
    ...(filters.status === "active" && { OR: [{ deadline: null }, { deadline: { gte: now } }] }),
    ...(filters.status === "expired" && { deadline: { lt: now } }),
    ...(filters.q && {
      translations: { some: { title: { contains: filters.q, mode: "insensitive" } } },
    }),
  };
}

function buildOrderBy(sort: ScholarshipQuery["sort"]): Prisma.ScholarshipOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "tuition_asc":
      return [{ coveragePercent: "asc" }];
    case "tuition_desc":
      return [{ coveragePercent: "desc" }];
    case "deadline":
      return [{ deadline: "asc" }];
    case "featured":
    case "relevance":
    default:
      return [{ deadline: "asc" }];
  }
}

const detailInclude = {
  translations: true,
  university: { include: { translations: true, country: true } },
  country: true,
  eligibilityCriteria: true,
  universityLinks: {
    include: { university: { include: { translations: true, country: true } } },
  },
  programLinks: {
    where: { program: { deletedAt: null } },
    include: {
      program: { include: { translations: true, university: { include: { translations: true } } } },
    },
  },
  articles: { where: { published: true, deletedAt: null }, include: { translations: true }, take: 3 },
} satisfies Prisma.ScholarshipInclude;

function mapScholarshipDetail(
  scholarship: Prisma.ScholarshipGetPayload<{ include: typeof detailInclude }>,
  locale: AppLocale,
) {
  return {
    ...scholarship,
    translation: pickTranslation(scholarship.translations, locale),
    university: scholarship.university
      ? { ...scholarship.university, translation: pickTranslation(scholarship.university.translations, locale) }
      : null,
    relatedUniversities: scholarship.universityLinks.map((link) => ({
      ...link.university,
      translation: pickTranslation(link.university.translations, locale),
    })),
    programs: scholarship.programLinks.map((link) => ({
      ...link.program,
      translation: pickTranslation(link.program.translations, locale),
      university: {
        ...link.program.university,
        translation: pickTranslation(link.program.university.translations, locale),
      },
    })),
    articles: scholarship.articles.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) })),
  };
}

export async function listScholarships(filters: ScholarshipQuery, locale: AppLocale, pageSize = PAGE_SIZE) {
  const page = filters.page ?? 1;
  const where = buildWhere(filters);

  const [rows, total] = await Promise.all([
    db.scholarship.findMany({
      where,
      include: { translations: true, university: { include: { translations: true } }, country: true },
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.scholarship.count({ where }),
  ]);

  const scholarships = rows.map((s) => ({
    ...s,
    translation: pickTranslation(s.translations, locale),
    university: s.university
      ? { ...s.university, translation: pickTranslation(s.university.translations, locale) }
      : null,
  }));
  return { scholarships, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getScholarshipBySlug(slug: string, locale: AppLocale) {
  const scholarship = await db.scholarship.findFirst({
    where: { slug, deletedAt: null },
    include: detailInclude,
  });
  if (!scholarship) return null;

  return mapScholarshipDetail(scholarship, locale);
}

export async function getScholarshipsBySlugsForComparison(slugs: string[], locale: AppLocale) {
  const rows = await db.scholarship.findMany({
    where: { slug: { in: slugs }, deletedAt: null },
    include: { translations: true, university: { include: { translations: true } }, country: true },
  });
  const bySlug = new Map(rows.map((s) => [s.slug, s]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      ...s,
      translation: pickTranslation(s.translations, locale),
      university: s.university
        ? { ...s.university, translation: pickTranslation(s.university.translations, locale) }
        : null,
    }));
}

export async function listRelatedScholarships(scholarshipId: string, countryId: string | null, locale: AppLocale, take = 3) {
  const rows = await db.scholarship.findMany({
    where: { deletedAt: null, visible: true, id: { not: scholarshipId }, ...(countryId && { countryId }) },
    include: { translations: true, university: { include: { translations: true } } },
    take,
  });
  return rows.map((s) => ({
    ...s,
    translation: pickTranslation(s.translations, locale),
    university: s.university
      ? { ...s.university, translation: pickTranslation(s.university.translations, locale) }
      : null,
  }));
}

export async function listLatestScholarships(locale: AppLocale, take = 6) {
  const rows = await db.scholarship.findMany({
    where: { deletedAt: null, visible: true },
    include: { translations: true, university: { include: { translations: true } } },
    orderBy: { deadline: "asc" },
    take,
  });
  return rows.map((s) => ({
    ...s,
    translation: pickTranslation(s.translations, locale),
    university: s.university
      ? { ...s.university, translation: pickTranslation(s.university.translations, locale) }
      : null,
  }));
}
