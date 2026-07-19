import "server-only";
import { db } from "@/lib/db";
import type {
  ScholarshipCreateInput,
  ScholarshipUpdateInput,
  ScholarshipEligibilityInput,
  ScholarshipProgramLinkInput,
  ScholarshipUniversityLinkInput,
} from "@/validation/admin/scholarship-admin.schema";

export async function createScholarship(input: ScholarshipCreateInput) {
  const { translations, ...scholarship } = input;
  return db.scholarship.create({
    data: {
      ...scholarship,
      translations: { create: translations },
    },
    include: { translations: true },
  });
}

export async function updateScholarship(input: ScholarshipUpdateInput) {
  const { id, translations, ...scholarship } = input;
  return db.$transaction(async (tx) => {
    if (translations) {
      for (const translation of translations) {
        await tx.scholarshipTranslation.upsert({
          where: { scholarshipId_locale: { scholarshipId: id, locale: translation.locale } },
          create: { ...translation, scholarshipId: id },
          update: translation,
        });
      }
    }
    return tx.scholarship.update({ where: { id }, data: scholarship, include: { translations: true } });
  });
}

export async function softDeleteScholarship(id: string) {
  return db.scholarship.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function createScholarshipEligibility(input: ScholarshipEligibilityInput) {
  return db.scholarshipEligibility.create({ data: input });
}

export async function deleteScholarshipEligibility(id: string) {
  return db.scholarshipEligibility.delete({ where: { id } });
}

export async function linkScholarshipProgram(input: ScholarshipProgramLinkInput) {
  return db.scholarshipProgram.upsert({
    where: { scholarshipId_programId: input },
    create: input,
    update: {},
  });
}

export async function unlinkScholarshipProgram(scholarshipId: string, programId: string) {
  return db.scholarshipProgram.delete({ where: { scholarshipId_programId: { scholarshipId, programId } } });
}

export async function linkScholarshipUniversity(input: ScholarshipUniversityLinkInput) {
  return db.scholarshipUniversity.upsert({
    where: { scholarshipId_universityId: input },
    create: input,
    update: {},
  });
}

export async function unlinkScholarshipUniversity(scholarshipId: string, universityId: string) {
  return db.scholarshipUniversity.delete({ where: { scholarshipId_universityId: { scholarshipId, universityId } } });
}
