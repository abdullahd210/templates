"use server";

import argon2 from "argon2";
import { db } from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/validation/auth.schema";
import { ConflictError, ValidationError, toUserMessage } from "@/lib/errors";

export interface RegisterResult {
  success: boolean;
  message: string;
}

/**
 * Registers a new student account: validates input, hashes the password,
 * and creates the User + StudentProfile + `student` UserRole in one
 * transaction. This is the concrete implementation behind Phase 1 item 10
 * ("Authentication architecture") — email verification sending is stubbed
 * behind the EmailProvider interface built in a later phase (see
 * docs/05-technical-architecture.md).
 */
export async function registerStudent(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const { fullName, email, password } = parsed.data;

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError("An account with this email already exists.");
    }

    const passwordHash = await argon2.hash(password);
    const studentRole = await db.role.findUnique({ where: { key: "student" } });

    await db.user.create({
      data: {
        email,
        name: fullName,
        passwordHash,
        studentProfile: { create: {} },
        ...(studentRole && { roles: { create: { roleId: studentRole.id } } }),
      },
    });

    return { success: true, message: "Account created. You can now sign in." };
  } catch (error) {
    if (error instanceof ConflictError || error instanceof ValidationError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: toUserMessage(error) };
  }
}
