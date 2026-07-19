import { describe, it, expect } from "vitest";
import { parseUniversityQuery } from "./university-query.schema";
import { parseProgramQuery } from "./program-query.schema";
import { parseScholarshipQuery } from "./scholarship-query.schema";

describe("parseUniversityQuery", () => {
  it("parses a full valid raw searchParams object", () => {
    const query = parseUniversityQuery({
      q: "biruni",
      country: "turkiye",
      city: "istanbul",
      type: "PRIVATE",
      degreeLevel: "BACHELORS",
      studyLanguage: "English",
      minTuition: "1000",
      maxTuition: "20000",
      scholarships: "true",
      admission: "OPEN",
      featured: "true",
      sort: "tuition_asc",
      page: "2",
    });

    expect(query).toMatchObject({
      q: "biruni",
      country: "turkiye",
      type: "PRIVATE",
      degreeLevel: "BACHELORS",
      minTuition: 100000,
      maxTuition: 2000000,
      scholarships: true,
      admission: "OPEN",
      featured: true,
      sort: "tuition_asc",
      page: 2,
    });
  });

  it("never throws on a tampered/malformed raw query string", () => {
    const raw = {
      type: "'; DROP TABLE University; --",
      degreeLevel: "<img src=x onerror=alert(1)>",
      admission: "not-a-status",
      page: "not-a-number",
      minTuition: "not-a-number",
      sort: "not-a-sort",
    };
    expect(() => parseUniversityQuery(raw)).not.toThrow();
    const query = parseUniversityQuery(raw);
    expect(query.type).toBeUndefined();
    expect(query.degreeLevel).toBeUndefined();
    expect(query.admission).toBeUndefined();
    expect(query.page).toBe(1);
    expect(query.minTuition).toBeUndefined();
    expect(query.sort).toBe("relevance");
  });

  it("takes the first value when Next.js hands back an array for a repeated key", () => {
    const query = parseUniversityQuery({ country: ["turkiye", "hungary"] });
    expect(query.country).toBe("turkiye");
  });

  it("defaults to an unfiltered, page-1 query when given an empty object", () => {
    const query = parseUniversityQuery({});
    expect(query.page).toBe(1);
    expect(query.sort).toBe("relevance");
    expect(query.country).toBeUndefined();
  });
});

describe("parseProgramQuery", () => {
  it("parses duration and tuition range filters", () => {
    const query = parseProgramQuery({ maxDuration: "24", minTuition: "500", maxTuition: "9000" });
    expect(query.maxDuration).toBe(24);
    expect(query.minTuition).toBe(50000);
    expect(query.maxTuition).toBe(900000);
  });

  it("degrades an invalid degree level to undefined rather than throwing", () => {
    const query = parseProgramQuery({ degreeLevel: "PROFESSOR" });
    expect(query.degreeLevel).toBeUndefined();
  });
});

describe("parseScholarshipQuery", () => {
  it("parses coverageType, degreeLevel, and status filters", () => {
    const query = parseScholarshipQuery({ coverageType: "FULL", degreeLevel: "MASTERS", status: "active" });
    expect(query.coverageType).toBe("FULL");
    expect(query.degreeLevel).toBe("MASTERS");
    expect(query.status).toBe("active");
  });

  it("degrades an invalid status value to undefined rather than throwing", () => {
    const query = parseScholarshipQuery({ status: "revoked" });
    expect(query.status).toBeUndefined();
  });
});
