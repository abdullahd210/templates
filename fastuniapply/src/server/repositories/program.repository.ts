import "server-only";
import { db } from "@/lib/db";
import type { AppLocale } from "@/i18n/config";
import { pickTranslation } from "./translation";
import type { Prisma } from "@prisma/client";
import type { ProgramQuery } from "@/validation/program-query.schema";

const PAGE_SIZE = 12;

function buildWhere(filters: ProgramQuery): Prisma.ProgramWhereInput {
  return {
    deletedAt: null,
    ...(filters.degreeLevel && { degreeLevel: filters.degreeLevel }),
    ...(filters.field && { field: { equals: filters.field, mode: "insensitive" } }),
    ...(filters.major && { major: { equals: filters.major, mode: "insensitive" } }),
    ...(filters.studyLanguage && { studyLanguage: { equals: filters.studyLanguage, mode: "insensitive" } }),
    ...(filters.admission && { admissionStatus: filters.admission }),
    ...(filters.featured !== undefined && filters.featured && { featured: true }),
    ...(filters.maxDuration !== undefined && { durationMonths: { lte: filters.maxDuration } }),
    ...(filters.university && { university: { slug: filters.university } }),
    ...(filters.country && { university: { country: { slug: filters.country } } }),
    ...(filters.scholarships !== undefined &&
      filters.scholarships && { scholarshipLinks: { some: { scholarship: { deletedAt: null, visible: true } } } }),
    ...((filters.minTuition !== undefined || filters.maxTuition !== undefined) && {
      fees: {
        some: {
          ...(filters.minTuition !== undefined && { tuitionMinor: { gte: filters.minTuition } }),
          ...(filters.maxTuition !== undefined && { tuitionMinor: { lte: filters.maxTuition } }),
        },
      },
    }),
    ...(filters.q && {
      translations: { some: { name: { contains: filters.q, mode: "insensitive" } } },
    }),
  };
}

function buildOrderBy(sort: ProgramQuery["sort"]): Prisma.ProgramOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "deadline":
      return [{ admissionStatus: "asc" }, { createdAt: "desc" }];
    case "featured":
      return [{ featured: "desc" }, { createdAt: "desc" }];
    case "relevance":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

const detailInclude = {
  translations: true,
  fees: true,
  intakes: { orderBy: { startDate: "asc" as const } },
  requirements: { include: { documentType: true } },
  university: { include: { country: true, translations: true } },
  scholarshipLinks: {
    where: { scholarship: { deletedAt: null, visible: true } },
    include: { scholarship: { include: { translations: true } } },
  },
  articles: { where: { published: true, deletedAt: null }, include: { translations: true }, take: 3 },
} satisfies Prisma.ProgramInclude;

function mapProgramDetail(program: Prisma.ProgramGetPayload<{ include: typeof detailInclude }>, locale: AppLocale) {
  return {
    ...program,
    translation: pickTranslation(program.translations, locale),
    university: { ...program.university, translation: pickTranslation(program.university.translations, locale) },
    scholarships: program.scholarshipLinks.map((link) => ({
      ...link.scholarship,
      translation: pickTranslation(link.scholarship.translations, locale),
    })),
    articles: program.articles.map((a) => ({ ...a, translation: pickTranslation(a.translations, locale) })),
  };
}

export async function listPrograms(filters: ProgramQuery, locale: AppLocale, pageSize = PAGE_SIZE) {
  const page = filters.page ?? 1;
  const where = buildWhere(filters);

  if (filters.sort === "name_asc" || filters.sort === "tuition_asc" || filters.sort === "tuition_desc") {
    const all = await db.program.findMany({
      where,
      select: { id: true, translations: { where: { locale } }, fees: { select: { tuitionMinor: true } } },
    });
    const sortable = all.map((p) => ({
      id: p.id,
      name: p.translations[0]?.name ?? "",
      tuition: p.fees[0]?.tuitionMinor ?? Number.MAX_SAFE_INTEGER,
    }));
    sortable.sort((a, b) => {
      if (filters.sort === "name_asc") return a.name.localeCompare(b.name);
      if (filters.sort === "tuition_asc") return a.tuition - b.tuition;
      return b.tuition - a.tuition;
    });
    const total = sortable.length;
    const pageIds = sortable.slice((page - 1) * pageSize, page * pageSize).map((p) => p.id);
    const rows = await db.program.findMany({
      where: { id: { in: pageIds } },
      include: {
        translations: true,
        fees: true,
        intakes: true,
        university: { include: { country: true, translations: true } },
      },
    });
    const order = new Map(pageIds.map((id, index) => [id, index]));
    rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    const programs = rows.map((p) => ({
      ...p,
      translation: pickTranslation(p.translations, locale),
      university: { ...p.university, translation: pickTranslation(p.university.translations, locale) },
    }));
    return { programs, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  const [rows, total] = await Promise.all([
    db.program.findMany({
      where,
      include: {
        translations: true,
        fees: true,
        intakes: true,
        university: { include: { country: true, translations: true } },
      },
      orderBy: buildOrderBy(filters.sort),
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
    include: detailInclude,
  });
  if (!program) return null;

  return mapProgramDetail(program, locale);
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
  const bySlug = new Map(rows.map((p) => [p.slug, p]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
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
  const majors = await db.program.findMany({
    where: { deletedAt: null },
    select: { major: true },
    distinct: ["major"],
    orderBy: { major: "asc" },
  });
  return {
    fields: fields.map((f) => f.field),
    languages: languages.map((l) => l.studyLanguage),
    majors: majors.map((m) => m.major),
  };
}
