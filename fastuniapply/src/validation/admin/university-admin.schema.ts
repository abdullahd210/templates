import { z } from "zod";
import { UniversityType, AdmissionStatus, Locale } from "@prisma/client";

/**
 * Zod schemas for the (not-yet-built) admin CRUD surface over the
 * university catalog. These are used by src/server/services/admin/
 * university-admin.service.ts today, and will back real admin routes/forms
 * in a later phase — kept here now so the validation contract exists before
 * the UI does.
 */

export const universityTranslationInputSchema = z.object({
  locale: z.nativeEnum(Locale),
  name: z.string().min(2).max(200),
  aboutText: z.string().max(20000).optional(),
  campusInfo: z.string().max(20000).optional(),
  admissionRequirements: z.string().max(20000).optional(),
  requiredDocumentsNote: z.string().max(20000).optional(),
  languageRequirements: z.string().max(20000).optional(),
  accommodationInfo: z.string().max(20000).optional(),
  studentLife: z.string().max(20000).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
});

export const universityCreateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."),
  countryId: z.string().min(1),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  type: z.nativeEnum(UniversityType),
  rankingGlobal: z.number().int().positive().optional(),
  rankingNational: z.number().int().positive().optional(),
  accreditations: z.array(z.string().min(1)).default([]),
  scholarshipsAvailable: z.boolean().default(false),
  admissionStatus: z.nativeEnum(AdmissionStatus).default("OPEN"),
  startingTuitionMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  websiteUrl: z.string().url().optional(),
  foundedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  isFeatured: z.boolean().default(false),
  translations: z.array(universityTranslationInputSchema).min(1, "At least one translation is required."),
});

export const universityUpdateSchema = universityCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const universityRankingInputSchema = z.object({
  universityId: z.string().min(1),
  source: z.string().min(1).max(200),
  year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
  rank: z.number().int().positive(),
  rankType: z.string().min(1).max(50).default("global"),
});

export const universityAccreditationInputSchema = z.object({
  universityId: z.string().min(1),
  name: z.string().min(1).max(200),
  issuingBody: z.string().max(200).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
});

export const universityGalleryInputSchema = z.object({
  universityId: z.string().min(1),
  imageUrl: z.string().url(),
  caption: z.string().max(200).optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const universityIntakeInputSchema = z.object({
  universityId: z.string().min(1),
  label: z.string().min(1).max(100),
  startDate: z.coerce.date(),
  applicationDeadline: z.coerce.date(),
  status: z.nativeEnum(AdmissionStatus).default("OPEN"),
});

export const countryInputSchema = z.object({
  isoCode: z.string().length(2).toUpperCase(),
  slug: z.string().min(2).max(100),
  name: z.string().min(2).max(200),
  callingCode: z.string().max(10).optional(),
});

export const cityInputSchema = z.object({
  countryId: z.string().min(1),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
});

export type UniversityCreateInput = z.infer<typeof universityCreateSchema>;
export type UniversityUpdateInput = z.infer<typeof universityUpdateSchema>;
export type UniversityRankingInput = z.infer<typeof universityRankingInputSchema>;
export type UniversityAccreditationInput = z.infer<typeof universityAccreditationInputSchema>;
export type UniversityGalleryInput = z.infer<typeof universityGalleryInputSchema>;
export type UniversityIntakeInput = z.infer<typeof universityIntakeInputSchema>;
export type CountryInput = z.infer<typeof countryInputSchema>;
export type CityInput = z.infer<typeof cityInputSchema>;
