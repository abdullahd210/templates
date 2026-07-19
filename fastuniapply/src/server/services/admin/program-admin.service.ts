import "server-only";
import type { Session } from "next-auth";
import { requirePermission } from "@/server/auth/rbac";
import {
  programCreateSchema,
  programUpdateSchema,
  programFeeInputSchema,
  programIntakeInputSchema,
  programRequirementInputSchema,
  academicFieldInputSchema,
  majorInputSchema,
  type ProgramCreateInput,
  type ProgramUpdateInput,
  type ProgramFeeInput,
  type ProgramIntakeInput,
  type ProgramRequirementInput,
  type AcademicFieldInput,
  type MajorInput,
} from "@/validation/admin/program-admin.schema";
import * as repo from "@/server/repositories/admin/program-admin.repository";

/** Admin-only mutation surface for the academic programs catalog — see university-admin.service.ts for the layering rationale. */

export async function createProgram(session: Session | null, input: ProgramCreateInput) {
  requirePermission(session, "programs.manage");
  const parsed = programCreateSchema.parse(input);
  return repo.createProgram(parsed);
}

export async function updateProgram(session: Session | null, input: ProgramUpdateInput) {
  requirePermission(session, "programs.manage");
  const parsed = programUpdateSchema.parse(input);
  return repo.updateProgram(parsed);
}

export async function deleteProgram(session: Session | null, id: string) {
  requirePermission(session, "programs.manage");
  return repo.softDeleteProgram(id);
}

export async function addProgramFee(session: Session | null, input: ProgramFeeInput) {
  requirePermission(session, "programs.manage");
  const parsed = programFeeInputSchema.parse(input);
  return repo.createProgramFee(parsed);
}

export async function removeProgramFee(session: Session | null, id: string) {
  requirePermission(session, "programs.manage");
  return repo.deleteProgramFee(id);
}

export async function addProgramIntake(session: Session | null, input: ProgramIntakeInput) {
  requirePermission(session, "programs.manage");
  const parsed = programIntakeInputSchema.parse(input);
  return repo.createProgramIntake(parsed);
}

export async function removeProgramIntake(session: Session | null, id: string) {
  requirePermission(session, "programs.manage");
  return repo.deleteProgramIntake(id);
}

export async function addProgramRequirement(session: Session | null, input: ProgramRequirementInput) {
  requirePermission(session, "programs.manage");
  const parsed = programRequirementInputSchema.parse(input);
  return repo.createProgramRequirement(parsed);
}

export async function removeProgramRequirement(session: Session | null, id: string) {
  requirePermission(session, "programs.manage");
  return repo.deleteProgramRequirement(id);
}

export async function upsertAcademicField(session: Session | null, input: AcademicFieldInput) {
  requirePermission(session, "programs.manage");
  const parsed = academicFieldInputSchema.parse(input);
  return repo.upsertAcademicField(parsed);
}

export async function upsertMajor(session: Session | null, input: MajorInput) {
  requirePermission(session, "programs.manage");
  const parsed = majorInputSchema.parse(input);
  return repo.upsertMajor(parsed);
}
