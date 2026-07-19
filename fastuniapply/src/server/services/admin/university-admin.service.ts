import "server-only";
import type { Session } from "next-auth";
import { requirePermission } from "@/server/auth/rbac";
import {
  universityCreateSchema,
  universityUpdateSchema,
  universityRankingInputSchema,
  universityAccreditationInputSchema,
  universityGalleryInputSchema,
  universityIntakeInputSchema,
  countryInputSchema,
  cityInputSchema,
  type UniversityCreateInput,
  type UniversityUpdateInput,
  type UniversityRankingInput,
  type UniversityAccreditationInput,
  type UniversityGalleryInput,
  type UniversityIntakeInput,
  type CountryInput,
  type CityInput,
} from "@/validation/admin/university-admin.schema";
import * as repo from "@/server/repositories/admin/university-admin.repository";

/**
 * Admin-only mutation surface for the university catalog. No route or
 * server action calls these yet (the admin dashboard is a later phase per
 * the current build scope) — this is the permission-gated, validated
 * service layer those routes will call, kept ready ahead of the UI so the
 * eventual admin dashboard is wiring, not new business logic.
 */

export async function createUniversity(session: Session | null, input: UniversityCreateInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityCreateSchema.parse(input);
  return repo.createUniversity(parsed);
}

export async function updateUniversity(session: Session | null, input: UniversityUpdateInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityUpdateSchema.parse(input);
  return repo.updateUniversity(parsed);
}

export async function deleteUniversity(session: Session | null, id: string) {
  requirePermission(session, "universities.manage");
  return repo.softDeleteUniversity(id);
}

export async function addUniversityRanking(session: Session | null, input: UniversityRankingInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityRankingInputSchema.parse(input);
  return repo.createUniversityRanking(parsed);
}

export async function removeUniversityRanking(session: Session | null, id: string) {
  requirePermission(session, "universities.manage");
  return repo.deleteUniversityRanking(id);
}

export async function addUniversityAccreditation(session: Session | null, input: UniversityAccreditationInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityAccreditationInputSchema.parse(input);
  return repo.createUniversityAccreditation(parsed);
}

export async function removeUniversityAccreditation(session: Session | null, id: string) {
  requirePermission(session, "universities.manage");
  return repo.deleteUniversityAccreditation(id);
}

export async function addUniversityGalleryImage(session: Session | null, input: UniversityGalleryInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityGalleryInputSchema.parse(input);
  return repo.createUniversityGalleryImage(parsed);
}

export async function removeUniversityGalleryImage(session: Session | null, id: string) {
  requirePermission(session, "universities.manage");
  return repo.deleteUniversityGalleryImage(id);
}

export async function addUniversityIntake(session: Session | null, input: UniversityIntakeInput) {
  requirePermission(session, "universities.manage");
  const parsed = universityIntakeInputSchema.parse(input);
  return repo.createUniversityIntake(parsed);
}

export async function removeUniversityIntake(session: Session | null, id: string) {
  requirePermission(session, "universities.manage");
  return repo.deleteUniversityIntake(id);
}

export async function upsertCountry(session: Session | null, input: CountryInput) {
  requirePermission(session, "universities.manage");
  const parsed = countryInputSchema.parse(input);
  return repo.upsertCountry(parsed);
}

export async function upsertCity(session: Session | null, input: CityInput) {
  requirePermission(session, "universities.manage");
  const parsed = cityInputSchema.parse(input);
  return repo.upsertCity(parsed);
}
