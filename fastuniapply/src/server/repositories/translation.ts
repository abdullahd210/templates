import type { AppLocale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

/**
 * Picks the translation row matching `locale`, falling back to the default
 * locale (en) and then to whatever is available. Catalog/content entities
 * are seeded in English only for now (see docs/08-development-roadmap.md) —
 * this keeps ar/tr pages fully functional (showing English copy) instead of
 * breaking while translations are filled in incrementally.
 */
export function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: AppLocale,
): T {
  const exact = translations.find((t) => t.locale === locale);
  if (exact) return exact;
  const fallback = translations.find((t) => t.locale === defaultLocale);
  if (fallback) return fallback;
  if (translations.length === 0) {
    throw new Error("No translations available for this record.");
  }
  return translations[0]!;
}
