import { describe, it, expect } from "vitest";
import { pickTranslation } from "./translation";

interface FakeTranslation {
  locale: string;
  name: string;
}

describe("pickTranslation — localization fallback", () => {
  it("returns the exact locale match when present", () => {
    const translations: FakeTranslation[] = [
      { locale: "en", name: "English name" },
      { locale: "ar", name: "الاسم بالعربية" },
    ];
    expect(pickTranslation(translations, "ar").name).toBe("الاسم بالعربية");
  });

  it("falls back to English when the requested locale is missing", () => {
    const translations: FakeTranslation[] = [{ locale: "en", name: "English name" }];
    const result = pickTranslation(translations, "tr");
    expect(result.locale).toBe("en");
    expect(result.name).toBe("English name");
  });

  it("falls back to whatever is available when even English is missing", () => {
    const translations: FakeTranslation[] = [{ locale: "tr", name: "Türkçe isim" }];
    const result = pickTranslation(translations, "ar");
    expect(result.locale).toBe("tr");
  });

  it("throws when there are no translations at all", () => {
    expect(() => pickTranslation([], "en")).toThrow();
  });
});
