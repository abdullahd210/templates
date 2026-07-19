"use server";

import { auth } from "@/server/auth";
import { toggleFavorite } from "@/server/services/favorite.service";
import { toUserMessage } from "@/lib/errors";
import type { ToggleFavoriteInput } from "@/validation/favorite.schema";

export interface ToggleFavoriteActionResult {
  success: boolean;
  favorited: boolean;
  message?: string;
  requiresAuth?: boolean;
}

export async function toggleFavoriteAction(input: ToggleFavoriteInput): Promise<ToggleFavoriteActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, favorited: false, requiresAuth: true, message: "Sign in to save favorites." };
  }

  try {
    const result = await toggleFavorite(session, input);
    return { success: true, favorited: result.favorited };
  } catch (error) {
    return { success: false, favorited: false, message: toUserMessage(error) };
  }
}
