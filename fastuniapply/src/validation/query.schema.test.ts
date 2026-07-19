import { describe, it, expect } from "vitest";
import { singleParam, pageParam, booleanParam, sortParam, moneyParam, intParam, enumParam } from "./query.schema";

describe("singleParam", () => {
  it("passes through a trimmed string", () => {
    expect(singleParam.parse("  hello  ")).toBe("hello");
  });

  it("takes the first value of an array", () => {
    expect(singleParam.parse(["a", "b"])).toBe("a");
  });

  it("treats 'all' and empty string as undefined", () => {
    expect(singleParam.parse("all")).toBeUndefined();
    expect(singleParam.parse("")).toBeUndefined();
    expect(singleParam.parse(undefined)).toBeUndefined();
  });
});

describe("pageParam", () => {
  it("defaults to 1 when missing", () => {
    expect(pageParam.parse(undefined)).toBe(1);
  });

  it("parses a valid page number", () => {
    expect(pageParam.parse("3")).toBe(3);
  });

  it("clamps non-numeric or non-positive values back to 1", () => {
    expect(pageParam.parse("abc")).toBe(1);
    expect(pageParam.parse("-5")).toBe(1);
    expect(pageParam.parse("0")).toBe(1);
  });

  it("clamps absurdly large page numbers instead of trusting them", () => {
    expect(pageParam.parse("999999999")).toBe(1000);
  });
});

describe("booleanParam", () => {
  it("is true only for the literal string 'true'", () => {
    expect(booleanParam.parse("true")).toBe(true);
    expect(booleanParam.parse("false")).toBe(false);
    expect(booleanParam.parse("1")).toBe(false);
    expect(booleanParam.parse(undefined)).toBe(false);
  });
});

describe("sortParam", () => {
  it("defaults to relevance", () => {
    expect(sortParam.parse(undefined)).toBe("relevance");
  });

  it("accepts a known sort option", () => {
    expect(sortParam.parse("tuition_asc")).toBe("tuition_asc");
  });

  it("degrades an unknown sort option to relevance instead of throwing", () => {
    expect(() => sortParam.parse("not-a-real-sort")).not.toThrow();
    expect(sortParam.parse("not-a-real-sort")).toBe("relevance");
  });
});

describe("moneyParam", () => {
  it("converts whole-currency-unit strings to minor units", () => {
    expect(moneyParam.parse("5000")).toBe(500000);
  });

  it("returns undefined for missing or invalid input", () => {
    expect(moneyParam.parse(undefined)).toBeUndefined();
    expect(moneyParam.parse("not-a-number")).toBeUndefined();
  });

  it("rejects negative amounts", () => {
    expect(moneyParam.parse("-100")).toBeUndefined();
  });
});

describe("intParam", () => {
  it("parses a non-negative integer", () => {
    expect(intParam.parse("24")).toBe(24);
  });

  it("returns undefined for negative or invalid input", () => {
    expect(intParam.parse("-1")).toBeUndefined();
    expect(intParam.parse("nope")).toBeUndefined();
  });
});

describe("enumParam — malformed/tampered URL values must not throw", () => {
  const degreeLevelParam = enumParam(["BACHELORS", "MASTERS", "PHD"] as const);

  it("accepts an allowed value", () => {
    expect(degreeLevelParam.parse("MASTERS")).toBe("MASTERS");
  });

  it("silently drops a value outside the allowed set instead of throwing", () => {
    expect(() => degreeLevelParam.parse("<script>alert(1)</script>")).not.toThrow();
    expect(degreeLevelParam.parse("<script>alert(1)</script>")).toBeUndefined();
  });

  it("silently drops case-mismatched or garbage enum values", () => {
    expect(degreeLevelParam.parse("bachelors")).toBeUndefined();
    expect(degreeLevelParam.parse("NOT_A_DEGREE")).toBeUndefined();
  });
});
