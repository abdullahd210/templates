import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Session } from "next-auth";
import { db } from "@/lib/db";
import { saveComparison, getMyComparison } from "./comparison.service";
import { MAX_COMPARISON_ITEMS } from "@/validation/comparison.schema";
import { UnauthenticatedError } from "@/lib/errors";

let userId: string;
let session: Session;
let universityIds: string[];

beforeAll(async () => {
  const user = await db.user.create({
    data: { email: `comparison-test-${Date.now()}@fastuniapply.test`, name: "Comparison Test User" },
  });
  userId = user.id;
  session = { user: { id: userId, roles: ["student"], permissions: [] }, expires: "" } as Session;

  const universities = await db.university.findMany({ take: 6, select: { id: true } });
  universityIds = universities.map((u) => u.id);
  expect(universityIds.length).toBeGreaterThanOrEqual(5);
});

afterAll(async () => {
  await db.comparisonItem.deleteMany({ where: { list: { userId } } });
  await db.comparisonList.deleteMany({ where: { userId } });
  await db.user.delete({ where: { id: userId } });
  await db.$disconnect();
});

describe("saveComparison — authorization", () => {
  it("throws UnauthenticatedError for a null session", async () => {
    await expect(
      saveComparison(null, { entityType: "UNIVERSITY", entityIds: universityIds.slice(0, 2) }),
    ).rejects.toBeInstanceOf(UnauthenticatedError);
  });
});

describe("saveComparison — maximum item limit", () => {
  it(`accepts exactly ${MAX_COMPARISON_ITEMS} items`, async () => {
    const ids = universityIds.slice(0, MAX_COMPARISON_ITEMS);
    const result = await saveComparison(session, { entityType: "UNIVERSITY", entityIds: ids });
    expect(result.entityIds).toHaveLength(MAX_COMPARISON_ITEMS);
  });

  it("rejects more than the max at the Zod schema layer before it ever reaches the database", async () => {
    // saveComparisonSchema's array .max(MAX_COMPARISON_ITEMS) is the first
    // gate saveComparison runs — never trust the raw input length.
    const fiveDistinctIds = universityIds.slice(0, 5);
    await expect(saveComparison(session, { entityType: "UNIVERSITY", entityIds: fiveDistinctIds })).rejects.toThrow();

    const { entityIds } = await getMyComparison(session, "UNIVERSITY");
    expect(entityIds.length).toBeLessThanOrEqual(MAX_COMPARISON_ITEMS);
  });

  it("dedupes repeated ids so they don't count twice against the limit", async () => {
    const withDuplicates = [universityIds[0]!, universityIds[0]!, universityIds[1]!, universityIds[1]!];
    const result = await saveComparison(session, { entityType: "UNIVERSITY", entityIds: withDuplicates });
    expect(result.entityIds).toHaveLength(2);
  });

  it("persists the saved comparison list and returns it via getMyComparison", async () => {
    const ids = universityIds.slice(0, 3);
    await saveComparison(session, { entityType: "UNIVERSITY", entityIds: ids });
    const { entityIds } = await getMyComparison(session, "UNIVERSITY");
    expect(entityIds.sort()).toEqual([...ids].sort());
  });

  it("returns an empty list for an unauthenticated session instead of throwing", async () => {
    const { entityIds } = await getMyComparison(null, "UNIVERSITY");
    expect(entityIds).toEqual([]);
  });
});
