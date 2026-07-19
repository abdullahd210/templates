import { z } from "zod";
import { DegreeLevel, AdmissionStatus, ProgramFeePeriod, Locale } from "@prisma/client";

export const programTranslationInputSchema = z.object({
  locale: z.nativeEnum(Locale),
  name: z.string().min(2).max(300),
  overview: z.string().max(20000).optional(),
  curriculumSummary: z.string().max(20000).optional(),
  careerOpportunities: z.string().max(20000).optional(),
  admissionRequirements: z.string().max(20000).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
});

export const programCreateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."),
  universityId: z.string().min(1),
  degreeLevel: z.nativeEnum(DegreeLevel),
  field: z.string().min(1).max(200),
  major: z.string().min(1).max(200),
  academicFieldId: z.string().min(1).optional(),
  majorId: z.string().min(1).optional(),
  studyLanguage: z.string().min(1).max(100),
  durationMonths: z.number().int().positive().max(120),
  applicationFeeMinor: z.number().int().nonnegative().default(0),
  currency: z.string().length(3).default("USD"),
  featured: z.boolean().default(false),
  applicationsEnabled: z.boolean().default(true),
  admissionStatus: z.nativeEnum(AdmissionStatus).default("OPEN"),
  translations: z.array(programTranslationInputSchema).min(1, "At least one translation is required."),
});

export const programUpdateSchema = programCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const programFeeInputSchema = z.object({
  programId: z.string().min(1),
  tuitionMinor: z.number().int().nonnegative(),
  discountedTuitionMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  period: z.nativeEnum(ProgramFeePeriod).default("PER_YEAR"),
});

export const programIntakeInputSchema = z.object({
  programId: z.string().min(1),
  startDate: z.coerce.date(),
  applicationDeadline: z.coerce.date(),
  status: z.nativeEnum(AdmissionStatus).default("OPEN"),
  capacity: z.number().int().positive().optional(),
});

export const programRequirementInputSchema = z.object({
  programId: z.string().min(1),
  documentTypeId: z.string().min(1),
  mandatory: z.boolean().default(true),
  note: z.string().max(500).optional(),
});

export const academicFieldInputSchema = z.object({
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
});

export const majorInputSchema = z.object({
  academicFieldId: z.string().min(1),
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
});

export type ProgramCreateInput = z.infer<typeof programCreateSchema>;
export type ProgramUpdateInput = z.infer<typeof programUpdateSchema>;
export type ProgramFeeInput = z.infer<typeof programFeeInputSchema>;
export type ProgramIntakeInput = z.infer<typeof programIntakeInputSchema>;
export type ProgramRequirementInput = z.infer<typeof programRequirementInputSchema>;
export type AcademicFieldInput = z.infer<typeof academicFieldInputSchema>;
export type MajorInput = z.infer<typeof majorInputSchema>;
