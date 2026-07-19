"use server";

import { auth } from "@/server/auth";
import { saveComparison } from "@/server/services/comparison.service";
import { toUserMessage } from "@/lib/errors";
import type { SaveComparisonInput } from "@/validation/comparison.schema";

export interface SaveComparisonActionResult {
  success: boolean;
  message?: string;
  requiresAuth?: boolean;
}

/** Lets a signed-in user save their current (locally-built) comparison selection for cross-device access. */
export async function saveComparisonAction(input: SaveComparisonInput): Promise<SaveComparisonActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, requiresAuth: true, message: "Sign in to save your comparison list." };
  }

  try {
    await saveComparison(session, input);
    return { success: true };
  } catch (error) {
    return { success: false, message: toUserMessage(error) };
  }
}
