import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { getUniversityBySlug, listUniversities } from "./university.repository";
import { parseUniversityQuery } from "@/validation/university-query.schema";

// These tests read the demo-seeded database (see prisma/seed/index.ts) —
// run `npm run db:seed` against a local PostgreSQL instance first.

afterAll(async () => {
  await db.$disconnect();
});

describe("getUniversityBySlug", () => {
  it("returns the university for a known seeded slug", async () => {
    const university = await getUniversityBySlug("istanbul-biruni-university", "en");
    expect(university).not.toBeNull();
    expect(university?.slug).toBe("istanbul-biruni-university");
    expect(university?.translation.name).toBe("Istanbul Biruni University");
    expect(university?.country.slug).toBe("turkiye");
  });

  it("returns null for a slug that does not exist (not-found behavior)", async () => {
    const university = await getUniversityBySlug("this-university-does-not-exist", "en");
    expect(university).toBeNull();
  });

  it("falls back to English when the requested locale has no translation", async () => {
    // Ranking Global University (technical-university-of-munich) only has an
    // English UniversityTranslation seeded — no ar/tr rows.
    const university = await getUniversityBySlug("technical-university-of-munich", "tr");
    expect(university).not.toBeNull();
    expect(university?.translation.locale).toBe("en");
  });

  it("returns the localized translation when one exists (Arabic sample)", async () => {
    const university = await getUniversityBySlug("istanbul-biruni-university", "ar");
    expect(university).not.toBeNull();
    expect(university?.translation.locale).toBe("ar");
    expect(university?.translation.name).toContain("بيروني");
  });
});

describe("listUniversities", () => {
  it("filters by country", async () => {
    const query = parseUniversityQuery({ country: "turkiye" });
    const { universities, total } = await listUniversities(query, "en");
    expect(total).toBeGreaterThan(0);
    for (const u of universities) {
      expect(u.country.slug).toBe("turkiye");
    }
  });

  it("filters by university type", async () => {
    const query = parseUniversityQuery({ type: "PUBLIC" });
    const { universities } = await listUniversities(query, "en");
    for (const u of universities) {
      expect(u.type).toBe("PUBLIC");
    }
  });

  it("filters by tuition range", async () => {
    const query = parseUniversityQuery({ minTuition: "0", maxTuition: "1000" });
    const { universities } = await listUniversities(query, "en");
    for (const u of universities) {
      if (u.startingTuitionMinor !== null) {
        expect(u.startingTuitionMinor).toBeLessThanOrEqual(100000);
      }
    }
  });

  it("paginates results", async () => {
    const pageOne = await listUniversities(parseUniversityQuery({ page: "1" }), "en");
    const pageTwo = await listUniversities(parseUniversityQuery({ page: "2" }), "en");
    expect(pageOne.universities.length).toBeGreaterThan(0);
    if (pageTwo.universities.length > 0) {
      expect(pageOne.universities[0]?.slug).not.toBe(pageTwo.universities[0]?.slug);
    }
  });

  it("sorts by tuition ascending", async () => {
    const { universities } = await listUniversities(parseUniversityQuery({ sort: "tuition_asc" }), "en");
    const tuitions = universities.map((u) => u.startingTuitionMinor ?? Number.MAX_SAFE_INTEGER);
    const sorted = [...tuitions].sort((a, b) => a - b);
    expect(tuitions).toEqual(sorted);
  });

  it("returns an empty page (not an error) for a filter combination with no matches", async () => {
    const { universities, total } = await listUniversities(
      parseUniversityQuery({ country: "turkiye", minTuition: "999999" }),
      "en",
    );
    expect(universities).toEqual([]);
    expect(total).toBe(0);
  });
});
