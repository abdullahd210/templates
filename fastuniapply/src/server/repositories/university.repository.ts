import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { AdmissionStatus, DegreeLevel, UniversityType } from "@prisma/client";

export interface UniversityFilters {
  countrySlug?: string;
  type?: UniversityType;
  degreeLevel?: DegreeLevel;
  scholarshipsAvailable?: boolean;
  admissionStatus?: AdmissionStatus;
  minTuitionMinor?: number;
  maxTuitionMinor?: number;
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function listUniversities(filters: UniversityFilters, locale: AppLocale) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;

  const where = {
    deletedAt: null,
    ...(filters.countrySlug && { country: { slug: filters.countrySlug } }),
    ...(filters.type && { type: filters.type }),
    ...(filters.scholarshipsAvailable !== undefined && {
      scholarshipsAvailable: filters.scholarshipsAvailable,
    }),
    ...(filters.admissionStatus && { admissionStatus: filters.admissionStatus }),
    ...(filters.degreeLevel && { programs: { some: { degreeLevel: filters.degreeLevel, deletedAt: null } } }),
    ...((filters.minTuitionMinor !== undefined || filters.maxTuitionMinor !== undefined) && {
      startingTuitionMinor: {
        ...(filters.minTuitionMinor !== undefined && { gte: filters.minTuitionMinor }),
        ...(filters.maxTuitionMinor !== undefined && { lte: filters.maxTuitionMinor }),
      },
    }),
    ...(filters.query && {
      translations: { some: { name: { contains: filters.query, mode: "insensitive" as const } } },
    }),
  };

  const [rows, total] = await Promise.all([
    db.university.findMany({
      where,
      include: {
        country: true,
        translations: true,
        _count: { select: { programs: { where: { deletedAt: null } } } },
      },
      orderBy: [{ isFeatured: "desc" }, { rankingGlobal: "asc" }],
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

export async function listUniversityFilterOptions() {
  const countries = await db.country.findMany({
    where: { deletedAt: null, universities: { some: { deletedAt: null } } },
    orderBy: { name: "asc" },
  });
  return { countries };
}
