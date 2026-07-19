import "server-only";
import { db } from "@/lib/db";
import type {
  ProgramCreateInput,
  ProgramUpdateInput,
  ProgramFeeInput,
  ProgramIntakeInput,
  ProgramRequirementInput,
  AcademicFieldInput,
  MajorInput,
} from "@/validation/admin/program-admin.schema";

export async function createProgram(input: ProgramCreateInput) {
  const { translations, ...program } = input;
  return db.program.create({
    data: {
      ...program,
      translations: { create: translations },
    },
    include: { translations: true },
  });
}

export async function updateProgram(input: ProgramUpdateInput) {
  const { id, translations, ...program } = input;
  return db.$transaction(async (tx) => {
    if (translations) {
      for (const translation of translations) {
        await tx.programTranslation.upsert({
          where: { programId_locale: { programId: id, locale: translation.locale } },
          create: { ...translation, programId: id },
          update: translation,
        });
      }
    }
    return tx.program.update({ where: { id }, data: program, include: { translations: true } });
  });
}

export async function softDeleteProgram(id: string) {
  return db.program.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function createProgramFee(input: ProgramFeeInput) {
  return db.programFee.create({ data: input });
}

export async function deleteProgramFee(id: string) {
  return db.programFee.delete({ where: { id } });
}

export async function createProgramIntake(input: ProgramIntakeInput) {
  return db.programIntake.create({ data: input });
}

export async function deleteProgramIntake(id: string) {
  return db.programIntake.delete({ where: { id } });
}

export async function createProgramRequirement(input: ProgramRequirementInput) {
  return db.programRequirement.create({ data: input });
}

export async function deleteProgramRequirement(id: string) {
  return db.programRequirement.delete({ where: { id } });
}

export async function upsertAcademicField(input: AcademicFieldInput) {
  return db.academicField.upsert({ where: { key: input.key }, create: input, update: input });
}

export async function upsertMajor(input: MajorInput) {
  return db.major.upsert({ where: { key: input.key }, create: input, update: input });
}
