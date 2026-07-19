import "server-only";
import type { Session } from "next-auth";
import { UnauthenticatedError, ValidationError } from "@/lib/errors";
import { getComparisonList, replaceComparisonItems } from "@/server/repositories/comparison.repository";
import { saveComparisonSchema, MAX_COMPARISON_ITEMS, type SaveComparisonInput } from "@/validation/comparison.schema";

/**
 * Persists a user's comparison selection (entity ids, e.g. university or
 * program ids) so it's available across devices. The "up to 4" limit is
 * enforced twice deliberately: once by the Zod schema (transport-layer
 * validation) and again here (business-rule invariant) — the second check
 * protects this function even if it's ever called from somewhere that
 * skips the schema.
 */
export async function saveComparison(session: Session | null, input: SaveComparisonInput) {
  if (!session?.user) {
    throw new UnauthenticatedError("Sign in to save your comparison list.");
  }
  const { entityType, entityIds } = saveComparisonSchema.parse(input);

  const deduped = Array.from(new Set(entityIds));
  if (deduped.length > MAX_COMPARISON_ITEMS) {
    throw new ValidationError(`You can compare up to ${MAX_COMPARISON_ITEMS} items.`, {
      entityIds: [`Maximum ${MAX_COMPARISON_ITEMS} items.`],
    });
  }

  await replaceComparisonItems(session.user.id, entityType, deduped);
  return { entityIds: deduped };
}

export async function getMyComparison(session: Session | null, entityType: SaveComparisonInput["entityType"]) {
  if (!session?.user) return { entityIds: [] as string[] };
  const list = await getComparisonList(session.user.id, entityType);
  return { entityIds: list?.items.map((i) => i.entityId) ?? [] };
}
