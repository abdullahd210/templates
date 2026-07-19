import { z } from "zod";
import { ScholarshipCoverageType, DegreeLevel } from "@prisma/client";
import { singleParam, pageParam, sortParam, enumParam } from "./query.schema";

export const scholarshipQuerySchema = z.object({
  q: singleParam,
  country: singleParam,
  university: singleParam,
  coverageType: enumParam(Object.values(ScholarshipCoverageType)),
  degreeLevel: enumParam(Object.values(DegreeLevel)),
  nationality: singleParam,
  status: enumParam(["active", "expired"] as const),
  sort: sortParam,
  page: pageParam,
});

export type ScholarshipQuery = z.infer<typeof scholarshipQuerySchema>;

export function parseScholarshipQuery(searchParams: Record<string, string | string[] | undefined>): ScholarshipQuery {
  return scholarshipQuerySchema.parse(searchParams);
}
