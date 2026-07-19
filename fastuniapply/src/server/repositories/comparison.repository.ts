import "server-only";
import { db } from "@/lib/db";
import type { ComparisonEntityType } from "@prisma/client";

export async function getComparisonList(userId: string, entityType: ComparisonEntityType) {
  return db.comparisonList.findUnique({
    where: { userId_entityType: { userId, entityType } },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

/** Replaces the full item set for a user's comparison list of a given type (upserting the list itself). */
export async function replaceComparisonItems(userId: string, entityType: ComparisonEntityType, entityIds: string[]) {
  return db.$transaction(async (tx) => {
    const list = await tx.comparisonList.upsert({
      where: { userId_entityType: { userId, entityType } },
      update: {},
      create: { userId, entityType },
    });
    await tx.comparisonItem.deleteMany({ where: { listId: list.id } });
    if (entityIds.length > 0) {
      await tx.comparisonItem.createMany({
        data: entityIds.map((entityId, index) => ({ listId: list.id, entityId, sortOrder: index })),
      });
    }
    return list;
  });
}
