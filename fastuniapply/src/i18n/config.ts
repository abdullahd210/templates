export const locales = ["en", "ar", "tr"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const rtlLocales: readonly AppLocale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

export const localeCurrency: Record<AppLocale, string> = {
  en: "USD",
  ar: "USD",
  tr: "TRY",
};
