import { describe, it, expect, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

// Validates that a `npm run db:seed` run produced data meeting the demo
// catalog minimums (see the task brief §12: ≥10 universities, ≥30 programs,
// ≥10 scholarships, ≥8 countries) and that every seeded row is explicitly
// marked isDemo — never presented as verified live data.

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("seed data minimums", () => {
  it("seeds at least 10 universities", async () => {
    const count = await prisma.university.count({ where: { deletedAt: null } });
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("seeds at least 30 academic programs", async () => {
    const count = await prisma.program.count({ where: { deletedAt: null } });
    expect(count).toBeGreaterThanOrEqual(30);
  });

  it("seeds at least 10 scholarships", async () => {
    const count = await prisma.scholarship.count({ where: { deletedAt: null } });
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("seeds at least 8 countries", async () => {
    const count = await prisma.country.count({ where: { deletedAt: null } });
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it("covers every country required by the task brief", async () => {
    const requiredSlugs = [
      "turkiye",
      "hungary",
      "germany",
      "poland",
      "italy",
      "malaysia",
      "cyprus",
      "united-kingdom",
      "canada",
      "united-states",
    ];
    const countries = await prisma.country.findMany({ where: { slug: { in: requiredSlugs } }, select: { slug: true } });
    expect(countries.map((c) => c.slug).sort()).toEqual([...requiredSlugs].sort());
  });

  it("seeds multiple degree levels, study languages, and academic fields", async () => {
    const degreeLevels = await prisma.program.findMany({ distinct: ["degreeLevel"], select: { degreeLevel: true } });
    const languages = await prisma.program.findMany({ distinct: ["studyLanguage"], select: { studyLanguage: true } });
    const fields = await prisma.academicField.count();
    expect(degreeLevels.length).toBeGreaterThan(1);
    expect(languages.length).toBeGreaterThan(1);
    expect(fields).toBeGreaterThan(1);
  });

  it("marks every seeded university, program, and scholarship as demo data", async () => {
    const nonDemoUniversities = await prisma.university.count({ where: { isDemo: false } });
    const nonDemoPrograms = await prisma.program.count({ where: { isDemo: false } });
    const nonDemoScholarships = await prisma.scholarship.count({ where: { isDemo: false } });
    expect(nonDemoUniversities).toBe(0);
    expect(nonDemoPrograms).toBe(0);
    expect(nonDemoScholarships).toBe(0);
  });

  it("stores all tuition and fee amounts as integer minor units, never floats", async () => {
    const fees = await prisma.programFee.findMany({ select: { tuitionMinor: true, discountedTuitionMinor: true } });
    for (const fee of fees) {
      expect(Number.isInteger(fee.tuitionMinor)).toBe(true);
      if (fee.discountedTuitionMinor !== null) {
        expect(Number.isInteger(fee.discountedTuitionMinor)).toBe(true);
      }
    }
  });
});
