import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Session } from "next-auth";
import { db } from "@/lib/db";
import { toggleFavorite, getFavoritedEntityIds } from "./favorite.service";
import { UnauthenticatedError } from "@/lib/errors";

let userId: string;
let session: Session;
let universityId: string;

beforeAll(async () => {
  const user = await db.user.create({
    data: { email: `favorite-test-${Date.now()}@fastuniapply.test`, name: "Favorite Test User" },
  });
  userId = user.id;
  session = { user: { id: userId, roles: ["student"], permissions: [] }, expires: "" } as Session;

  const university = await db.university.findFirstOrThrow({ where: { slug: "istanbul-biruni-university" } });
  universityId = university.id;
});

afterAll(async () => {
  await db.favorite.deleteMany({ where: { userId } });
  await db.user.delete({ where: { id: userId } });
  await db.$disconnect();
});

describe("toggleFavorite — authorization", () => {
  it("throws UnauthenticatedError for a null session", async () => {
    await expect(toggleFavorite(null, { entityType: "UNIVERSITY", entityId: universityId })).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("adds a favorite for an authenticated user", async () => {
    const result = await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });
    expect(result.favorited).toBe(true);

    const ids = await getFavoritedEntityIds(session, "UNIVERSITY");
    expect(ids.has(universityId)).toBe(true);
  });

  it("removes the favorite on a second toggle instead of creating a duplicate", async () => {
    const result = await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });
    expect(result.favorited).toBe(false);

    const rows = await db.favorite.findMany({ where: { userId, entityType: "UNIVERSITY", entityId: universityId } });
    expect(rows).toHaveLength(0);
  });
});

describe("toggleFavorite — duplicate prevention", () => {
  it("never creates two favorite rows for the same (user, entityType, entityId)", async () => {
    // Toggle on, then attempt to race a second "add" by calling the
    // repository create directly is prevented by the unique constraint;
    // here we assert the service's own existence check keeps exactly one row.
    await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });
    const rows = await db.favorite.findMany({ where: { userId, entityType: "UNIVERSITY", entityId: universityId } });
    expect(rows).toHaveLength(1);
    // Clean up: toggle back off.
    await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });
  });
});

describe("getFavoritedEntityIds — ownership scoping", () => {
  it("returns an empty set for an unauthenticated session", async () => {
    const ids = await getFavoritedEntityIds(null, "UNIVERSITY");
    expect(ids.size).toBe(0);
  });

  it("only returns the acting user's own favorites", async () => {
    const otherUser = await db.user.create({
      data: { email: `favorite-test-other-${Date.now()}@fastuniapply.test`, name: "Other User" },
    });
    const otherSession = { user: { id: otherUser.id, roles: ["student"], permissions: [] }, expires: "" } as Session;

    await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });

    const otherIds = await getFavoritedEntityIds(otherSession, "UNIVERSITY");
    expect(otherIds.has(universityId)).toBe(false);

    const ownIds = await getFavoritedEntityIds(session, "UNIVERSITY");
    expect(ownIds.has(universityId)).toBe(true);

    await toggleFavorite(session, { entityType: "UNIVERSITY", entityId: universityId });
    await db.user.delete({ where: { id: otherUser.id } });
  });
});
