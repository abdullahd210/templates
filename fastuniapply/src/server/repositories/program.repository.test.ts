import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { getProgramBySlug, listPrograms } from "./program.repository";
import { parseProgramQuery } from "@/validation/program-query.schema";

afterAll(async () => {
  await db.$disconnect();
});

describe("getProgramBySlug", () => {
  it("returns the program with its university and scholarship links for a known slug", async () => {
    const program = await getProgramBySlug("computer-engineering-bachelors", "en");
    expect(program).not.toBeNull();
    expect(program?.university.slug).toBe("istanbul-biruni-university");
    expect(program?.translation.name).toBe("Computer Engineering");
  });

  it("maps eligible scholarships through the ScholarshipProgram join table", async () => {
    // tum-excellence-scholarship is linked via ScholarshipProgram, not the
    // legacy implicit relation — this exercises the post-migration mapping.
    const program = await getProgramBySlug("electrical-engineering-masters", "en");
    expect(program).not.toBeNull();
    expect(program?.scholarships.some((s) => s.slug === "tum-excellence-scholarship")).toBe(true);
  });

  it("returns null for an unknown slug (not-found behavior)", async () => {
    const program = await getProgramBySlug("no-such-program-slug", "en");
    expect(program).toBeNull();
  });
});

describe("listPrograms", () => {
  it("filters by degree level", async () => {
    const { programs } = await listPrograms(parseProgramQuery({ degreeLevel: "MASTERS" }), "en");
    for (const p of programs) {
      expect(p.degreeLevel).toBe("MASTERS");
    }
  });

  it("filters by university", async () => {
    const { programs, total } = await listPrograms(
      parseProgramQuery({ university: "istanbul-biruni-university" }),
      "en",
    );
    expect(total).toBeGreaterThan(0);
    for (const p of programs) {
      expect(p.university.slug).toBe("istanbul-biruni-university");
    }
  });

  it("filters by maxDuration", async () => {
    const { programs } = await listPrograms(parseProgramQuery({ maxDuration: "12" }), "en");
    for (const p of programs) {
      expect(p.durationMonths).toBeLessThanOrEqual(12);
    }
  });

  it("includes the newly supported ASSOCIATE and CERTIFICATE degree levels", async () => {
    const associate = await listPrograms(parseProgramQuery({ degreeLevel: "ASSOCIATE" }), "en");
    const certificate = await listPrograms(parseProgramQuery({ degreeLevel: "CERTIFICATE" }), "en");
    expect(associate.total).toBeGreaterThan(0);
    expect(certificate.total).toBeGreaterThan(0);
  });
});
