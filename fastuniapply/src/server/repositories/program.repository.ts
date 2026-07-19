import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { AdmissionStatus, DegreeLevel } from "@prisma/client";

export interface ProgramFilters {
  countrySlug?: string;
  universitySlug?: string;
  degreeLevel?: DegreeLevel;
  field?: string;
  studyLanguage?: string;
  admissionStatus?: AdmissionStatus;
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function listPrograms(filters: ProgramFilters, locale: AppLocale) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;

  const where = {
    deletedAt: null,
    ...(filters.degreeLevel && { degreeLevel: filters.degreeLevel }),
    ...(filters.field && { field: filters.field }),
    ...(filters.studyLanguage && { studyLanguage: filters.studyLanguage }),
    ...(filters.admissionStatus && { admissionStatus: filters.admissionStatus }),
    ...(filters.universitySlug && { university: { slug: filters.universitySlug } }),
    ...(filters.countrySlug && { university: { country: { slug: filters.countrySlug } } }),
    ...(filters.query && {
      translations: { some: { name: { contains: filters.query, mode: "insensitive" as const } } },
    }),
  };

  const [rows, total] = await Promise.all([
    db.program.findMany({
      where,
      include: {
        translations: true,
        fees: true,
        intakes: true,
        university: { include: { country: true, translations: true } },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.program.count({ where }),
  ]);

  const programs = rows.map((p) => ({
    ...p,
    translation: pickTranslation(p.translations, locale),
    university: { ...p.university, translation: pickTranslation(p.university.translations, locale) },
  }));

  return { programs, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProgramBySlug(slug: string, locale: AppLocale) {
  const program = await db.program.findFirst({
    where: { slug, deletedAt: null },
    include: {
      translations: true,
      fees: true,
      intakes: { orderBy: { startDate: "asc" } },
      requirements: { include: { documentType: true } },
      university: { include: { country: true, translations: true } },
      scholarships: { where: { deletedAt: null, visible: true }, include: { translations: true } },
    },
  });
  if (!program) return null;

  return {
    ...program,
    translation: pickTranslation(program.translations, locale),
    university: { ...program.university, translation: pickTranslation(program.university.translations, locale) },
    scholarships: program.scholarships.map((s) => ({ ...s, translation: pickTranslation(s.translations, locale) })),
  };
}

export async function listFeaturedPrograms(locale: AppLocale, take = 6) {
  const rows = await db.program.findMany({
    where: { deletedAt: null, featured: true },
    include: {
      translations: true,
      fees: true,
      university: { include: { country: true, translations: true } },
    },
    take,
  });
  return rows.map((p) => ({
    ...p,
    translation: pickTranslation(p.translations, locale),
    university: { ...p.university, translation: pickTranslation(p.university.translations, locale) },
  }));
}

export async function getProgramsBySlugsForComparison(slugs: string[], locale: AppLocale) {
  const rows = await db.program.findMany({
    where: { slug: { in: slugs }, deletedAt: null },
    include: {
      translations: true,
      fees: true,
      intakes: true,
      university: { include: { country: true, translations: true } },
    },
  });
  return rows.map((p) => ({
    ...p,
    translation: pickTranslation(p.translations, locale),
    university: { ...p.university, translation: pickTranslation(p.university.translations, locale) },
  }));
}

export async function listProgramFilterOptions() {
  const fields = await db.program.findMany({
    where: { deletedAt: null },
    select: { field: true },
    distinct: ["field"],
    orderBy: { field: "asc" },
  });
  const languages = await db.program.findMany({
    where: { deletedAt: null },
    select: { studyLanguage: true },
    distinct: ["studyLanguage"],
    orderBy: { studyLanguage: "asc" },
  });
  return { fields: fields.map((f) => f.field), languages: languages.map((l) => l.studyLanguage) };
}
