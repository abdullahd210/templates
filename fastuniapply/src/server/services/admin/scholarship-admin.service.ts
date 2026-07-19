import "server-only";
import type { Session } from "next-auth";
import { requirePermission } from "@/server/auth/rbac";
import {
  scholarshipCreateSchema,
  scholarshipUpdateSchema,
  scholarshipEligibilityInputSchema,
  scholarshipProgramLinkInputSchema,
  scholarshipUniversityLinkInputSchema,
  type ScholarshipCreateInput,
  type ScholarshipUpdateInput,
  type ScholarshipEligibilityInput,
  type ScholarshipProgramLinkInput,
  type ScholarshipUniversityLinkInput,
} from "@/validation/admin/scholarship-admin.schema";
import * as repo from "@/server/repositories/admin/scholarship-admin.repository";

/** Admin-only mutation surface for scholarships — see university-admin.service.ts for the layering rationale. */

export async function createScholarship(session: Session | null, input: ScholarshipCreateInput) {
  requirePermission(session, "scholarships.manage");
  const parsed = scholarshipCreateSchema.parse(input);
  return repo.createScholarship(parsed);
}

export async function updateScholarship(session: Session | null, input: ScholarshipUpdateInput) {
  requirePermission(session, "scholarships.manage");
  const parsed = scholarshipUpdateSchema.parse(input);
  return repo.updateScholarship(parsed);
}

export async function deleteScholarship(session: Session | null, id: string) {
  requirePermission(session, "scholarships.manage");
  return repo.softDeleteScholarship(id);
}

export async function addScholarshipEligibility(session: Session | null, input: ScholarshipEligibilityInput) {
  requirePermission(session, "scholarships.manage");
  const parsed = scholarshipEligibilityInputSchema.parse(input);
  return repo.createScholarshipEligibility(parsed);
}

export async function removeScholarshipEligibility(session: Session | null, id: string) {
  requirePermission(session, "scholarships.manage");
  return repo.deleteScholarshipEligibility(id);
}

export async function linkScholarshipProgram(session: Session | null, input: ScholarshipProgramLinkInput) {
  requirePermission(session, "scholarships.manage");
  const parsed = scholarshipProgramLinkInputSchema.parse(input);
  return repo.linkScholarshipProgram(parsed);
}

export async function unlinkScholarshipProgram(session: Session | null, scholarshipId: string, programId: string) {
  requirePermission(session, "scholarships.manage");
  return repo.unlinkScholarshipProgram(scholarshipId, programId);
}

export async function linkScholarshipUniversity(session: Session | null, input: ScholarshipUniversityLinkInput) {
  requirePermission(session, "scholarships.manage");
  const parsed = scholarshipUniversityLinkInputSchema.parse(input);
  return repo.linkScholarshipUniversity(parsed);
}

export async function unlinkScholarshipUniversity(session: Session | null, scholarshipId: string, universityId: string) {
  requirePermission(session, "scholarships.manage");
  return repo.unlinkScholarshipUniversity(scholarshipId, universityId);
}
