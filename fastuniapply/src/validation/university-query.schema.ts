import { z } from "zod";
import { UniversityType, AdmissionStatus, DegreeLevel } from "@prisma/client";
import { singleParam, pageParam, booleanParam, sortParam, moneyParam, enumParam } from "./query.schema";

export const universityQuerySchema = z.object({
  q: singleParam,
  country: singleParam,
  city: singleParam,
  type: enumParam(Object.values(UniversityType)),
  degreeLevel: enumParam(Object.values(DegreeLevel)),
  studyLanguage: singleParam,
  minTuition: moneyParam,
  maxTuition: moneyParam,
  scholarships: booleanParam,
  admission: enumParam(Object.values(AdmissionStatus)),
  featured: booleanParam,
  sort: sortParam,
  page: pageParam,
});

export type UniversityQuery = z.infer<typeof universityQuerySchema>;

/** Parses a Next.js `searchParams` object (values may be string | string[] | undefined). */
export function parseUniversityQuery(searchParams: Record<string, string | string[] | undefined>): UniversityQuery {
  return universityQuerySchema.parse(searchParams);
}
