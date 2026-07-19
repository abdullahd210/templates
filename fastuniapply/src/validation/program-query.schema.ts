import { z } from "zod";
import { DegreeLevel, AdmissionStatus } from "@prisma/client";
import { singleParam, pageParam, booleanParam, sortParam, moneyParam, intParam, enumParam } from "./query.schema";

export const programQuerySchema = z.object({
  q: singleParam,
  country: singleParam,
  university: singleParam,
  degreeLevel: enumParam(Object.values(DegreeLevel)),
  field: singleParam,
  major: singleParam,
  studyLanguage: singleParam,
  minTuition: moneyParam,
  maxTuition: moneyParam,
  maxDuration: intParam,
  scholarships: booleanParam,
  admission: enumParam(Object.values(AdmissionStatus)),
  featured: booleanParam,
  sort: sortParam,
  page: pageParam,
});

export type ProgramQuery = z.infer<typeof programQuerySchema>;

export function parseProgramQuery(searchParams: Record<string, string | string[] | undefined>): ProgramQuery {
  return programQuerySchema.parse(searchParams);
}
