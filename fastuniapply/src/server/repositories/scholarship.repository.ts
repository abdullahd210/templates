import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { ScholarshipCoverageType } from "@prisma/client";

export interface ScholarshipFilters {
  countrySlug?: string;
  universitySlug?: string;
  coverageType?: ScholarshipCoverageType;
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function listScholarships(filters: ScholarshipFilters, locale: AppLocale) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;

  const where = {
    deletedAt: null,
    visible: true,
    ...(filters.coverageType && { coverageType: filters.coverageType }),
    ...(filters.countrySlug && { country: { slug: filters.countrySlug } }),
    ...(filters.universitySlug && { university: { slug: filters.universitySlug } }),
    ...(filters.query && {
      translations: { some: { title: { contains: filters.query, mode: "insensitive" as const } } },
    }),
  };

  const [rows, total] = await Promise.all([
    db.scholarship.findMany({
      where,
      include: { translations: true, university: { include: { translations: true } }, country: true },
      orderBy: [{ deadline: "asc" }],
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
    include: {
      translations: true,
      university: { include: { translations: true, country: true } },
      country: true,
      programs: { where: { deletedAt: null }, include: { translations: true, university: true } },
    },
  });
  if (!scholarship) return null;

  return {
    ...scholarship,
    translation: pickTranslation(scholarship.translations, locale),
    university: scholarship.university
      ? { ...scholarship.university, translation: pickTranslation(scholarship.university.translations, locale) }
      : null,
  };
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
