import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { getScholarshipBySlug, listScholarships } from "./scholarship.repository";
import { parseScholarshipQuery } from "@/validation/scholarship-query.schema";

afterAll(async () => {
  await db.$disconnect();
});

describe("getScholarshipBySlug", () => {
  it("returns eligible programs through the ScholarshipProgram join table", async () => {
    const scholarship = await getScholarshipBySlug("tum-excellence-scholarship", "en");
    expect(scholarship).not.toBeNull();
    expect(scholarship?.programs.some((p) => p.slug === "electrical-engineering-masters")).toBe(true);
  });

  it("returns related universities through the ScholarshipUniversity join table", async () => {
    const scholarship = await getScholarshipBySlug("full-scholarship-turkiye", "en");
    expect(scholarship).not.toBeNull();
    const slugs = scholarship?.relatedUniversities.map((u) => u.slug) ?? [];
    expect(slugs).toContain("istanbul-biruni-university");
    expect(slugs).toContain("ankara-science-university");
  });

  it("returns structured eligibility criteria derived from degree levels and nationalities", async () => {
    const scholarship = await getScholarshipBySlug("full-scholarship-turkiye", "en");
    expect(scholarship).not.toBeNull();
    expect(scholarship!.eligibilityCriteria.length).toBeGreaterThan(0);
    expect(scholarship!.eligibilityCriteria.some((c) => c.criteriaType === "DEGREE_LEVEL")).toBe(true);
  });

  it("returns the localized translation when one exists (Turkish sample)", async () => {
    const scholarship = await getScholarshipBySlug("full-scholarship-turkiye", "tr");
    expect(scholarship?.translation.locale).toBe("tr");
  });

  it("returns null for an unknown slug", async () => {
    const scholarship = await getScholarshipBySlug("no-such-scholarship", "en");
    expect(scholarship).toBeNull();
  });
});

describe("listScholarships", () => {
  it("filters by degree level", async () => {
    const { scholarships } = await listScholarships(parseScholarshipQuery({ degreeLevel: "PHD" }), "en");
    for (const s of scholarships) {
      expect(s.eligibleDegreeLevels).toContain("PHD");
    }
  });

  it("filters by active status (deadline in the future)", async () => {
    const { scholarships } = await listScholarships(parseScholarshipQuery({ status: "active" }), "en");
    const now = Date.now();
    for (const s of scholarships) {
      if (s.deadline) {
        expect(new Date(s.deadline).getTime()).toBeGreaterThanOrEqual(now);
      }
    }
  });

  it("filters by coverage type", async () => {
    const { scholarships } = await listScholarships(parseScholarshipQuery({ coverageType: "FULL" }), "en");
    for (const s of scholarships) {
      expect(s.coverageType).toBe("FULL");
    }
  });
});
