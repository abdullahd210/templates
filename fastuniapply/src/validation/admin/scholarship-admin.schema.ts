import { z } from "zod";
import { ScholarshipCoverageType, DegreeLevel, EligibilityCriteriaType, Locale } from "@prisma/client";

export const scholarshipTranslationInputSchema = z.object({
  locale: z.nativeEnum(Locale),
  title: z.string().min(2).max(300),
  providerName: z.string().max(200).optional(),
  eligibilityText: z.string().max(20000).optional(),
  requiredDocumentsNote: z.string().max(20000).optional(),
  applicationProcess: z.string().max(20000).optional(),
  termsAndConditions: z.string().max(20000).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
});

export const scholarshipCreateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."),
  universityId: z.string().min(1).optional(),
  countryId: z.string().min(1).optional(),
  coverageType: z.nativeEnum(ScholarshipCoverageType),
  coveragePercent: z.number().min(0).max(100).optional(),
  fundingType: z.string().max(100).optional(),
  deadline: z.coerce.date().optional(),
  eligibleDegreeLevels: z.array(z.nativeEnum(DegreeLevel)).default([]),
  eligibleNationalities: z.array(z.string().min(1)).default([]),
  visible: z.boolean().default(true),
  translations: z.array(scholarshipTranslationInputSchema).min(1, "At least one translation is required."),
});

export const scholarshipUpdateSchema = scholarshipCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const scholarshipEligibilityInputSchema = z.object({
  scholarshipId: z.string().min(1),
  criteriaType: z.nativeEnum(EligibilityCriteriaType),
  value: z.string().min(1).max(300),
  notes: z.string().max(500).optional(),
});

export const scholarshipProgramLinkInputSchema = z.object({
  scholarshipId: z.string().min(1),
  programId: z.string().min(1),
});

export const scholarshipUniversityLinkInputSchema = z.object({
  scholarshipId: z.string().min(1),
  universityId: z.string().min(1),
});

export type ScholarshipCreateInput = z.infer<typeof scholarshipCreateSchema>;
export type ScholarshipUpdateInput = z.infer<typeof scholarshipUpdateSchema>;
export type ScholarshipEligibilityInput = z.infer<typeof scholarshipEligibilityInputSchema>;
export type ScholarshipProgramLinkInput = z.infer<typeof scholarshipProgramLinkInputSchema>;
export type ScholarshipUniversityLinkInput = z.infer<typeof scholarshipUniversityLinkInputSchema>;
