import "server-only";
import { db } from "@/lib/db";
import type { FavoriteEntityType } from "@prisma/client";

export function findFavorite(userId: string, entityType: FavoriteEntityType, entityId: string) {
  return db.favorite.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
}

export function listFavoriteIds(userId: string, entityType: FavoriteEntityType) {
  return db.favorite
    .findMany({ where: { userId, entityType }, select: { entityId: true } })
    .then((rows) => new Set(rows.map((r) => r.entityId)));
}

export function createFavorite(userId: string, entityType: FavoriteEntityType, entityId: string) {
  return db.favorite.create({ data: { userId, entityType, entityId } });
}

export function deleteFavorite(userId: string, entityType: FavoriteEntityType, entityId: string) {
  return db.favorite.delete({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
}

export function listFavoritesForUser(userId: string, entityType: FavoriteEntityType) {
  return db.favorite.findMany({ where: { userId, entityType }, orderBy: { createdAt: "desc" } });
}
