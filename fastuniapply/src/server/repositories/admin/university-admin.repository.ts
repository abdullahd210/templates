import "server-only";
import { db } from "@/lib/db";
import type {
  UniversityCreateInput,
  UniversityUpdateInput,
  UniversityRankingInput,
  UniversityAccreditationInput,
  UniversityGalleryInput,
  UniversityIntakeInput,
  CountryInput,
  CityInput,
} from "@/validation/admin/university-admin.schema";

/**
 * Plain Prisma writes for the university admin surface — no auth checks
 * here (that's the service layer's job, see admin/university-admin.service.ts).
 * Kept as its own repository so future admin route handlers/actions never
 * embed Prisma calls directly, matching the read-side repository convention.
 */

export async function createUniversity(input: UniversityCreateInput) {
  const { translations, ...university } = input;
  return db.university.create({
    data: {
      ...university,
      translations: { create: translations },
    },
    include: { translations: true },
  });
}

export async function updateUniversity(input: UniversityUpdateInput) {
  const { id, translations, ...university } = input;
  return db.$transaction(async (tx) => {
    if (translations) {
      for (const translation of translations) {
        await tx.universityTranslation.upsert({
          where: { universityId_locale: { universityId: id, locale: translation.locale } },
          create: { ...translation, universityId: id },
          update: translation,
        });
      }
    }
    return tx.university.update({ where: { id }, data: university, include: { translations: true } });
  });
}

export async function softDeleteUniversity(id: string) {
  return db.university.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function createUniversityRanking(input: UniversityRankingInput) {
  return db.universityRanking.create({ data: input });
}

export async function deleteUniversityRanking(id: string) {
  return db.universityRanking.delete({ where: { id } });
}

export async function createUniversityAccreditation(input: UniversityAccreditationInput) {
  return db.universityAccreditation.create({ data: input });
}

export async function deleteUniversityAccreditation(id: string) {
  return db.universityAccreditation.delete({ where: { id } });
}

export async function createUniversityGalleryImage(input: UniversityGalleryInput) {
  return db.universityGallery.create({ data: input });
}

export async function deleteUniversityGalleryImage(id: string) {
  return db.universityGallery.delete({ where: { id } });
}

export async function createUniversityIntake(input: UniversityIntakeInput) {
  return db.universityIntake.create({ data: input });
}

export async function deleteUniversityIntake(id: string) {
  return db.universityIntake.delete({ where: { id } });
}

export async function upsertCountry(input: CountryInput) {
  return db.country.upsert({
    where: { isoCode: input.isoCode },
    create: input,
    update: input,
  });
}

export async function upsertCity(input: CityInput) {
  const existing = input.slug
    ? await db.city.findFirst({ where: { countryId: input.countryId, slug: input.slug } })
    : null;
  if (existing) {
    return db.city.update({ where: { id: existing.id }, data: input });
  }
  return db.city.create({ data: input });
}
