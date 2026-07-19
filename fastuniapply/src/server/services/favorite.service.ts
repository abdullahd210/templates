import "server-only";
import type { Session } from "next-auth";
import { UnauthenticatedError } from "@/lib/errors";
import {
  findFavorite,
  createFavorite,
  deleteFavorite,
  listFavoriteIds,
  listFavoritesForUser,
} from "@/server/repositories/favorite.repository";
import { toggleFavoriteSchema, type ToggleFavoriteInput } from "@/validation/favorite.schema";
import type { FavoriteEntityType } from "@prisma/client";

export interface ToggleFavoriteResult {
  favorited: boolean;
}

/**
 * Adds or removes a favorite for the signed-in user. Favorites are always
 * scoped to `session.user.id` — there is no `userId` in the input, so a
 * caller can never favorite on another user's behalf (see docs/05
 * §6 "row-level ownership"). Duplicate favorites are prevented by the
 * Favorite table's (userId, entityType, entityId) unique constraint as well
 * as this existence check, so a double-click can't create two rows.
 */
export async function toggleFavorite(session: Session | null, input: ToggleFavoriteInput): Promise<ToggleFavoriteResult> {
  if (!session?.user) {
    throw new UnauthenticatedError("Sign in to save favorites.");
  }
  const { entityType, entityId } = toggleFavoriteSchema.parse(input);
  const userId = session.user.id;

  const existing = await findFavorite(userId, entityType, entityId);
  if (existing) {
    await deleteFavorite(userId, entityType, entityId);
    return { favorited: false };
  }

  await createFavorite(userId, entityType, entityId);
  return { favorited: true };
}

/** Set of entityIds the current user has favorited, for a given type — used to hydrate card state in bulk. */
export async function getFavoritedEntityIds(session: Session | null, entityType: FavoriteEntityType): Promise<Set<string>> {
  if (!session?.user) return new Set();
  return listFavoriteIds(session.user.id, entityType);
}

/** A user's own favorites list. Never accepts a userId param — always the acting session's own records. */
export async function getMyFavorites(session: Session | null, entityType: FavoriteEntityType) {
  if (!session?.user) {
    throw new UnauthenticatedError("Sign in to view your favorites.");
  }
  return listFavoritesForUser(session.user.id, entityType);
}
