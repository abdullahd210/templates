import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type AppLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as AppLocale) ? (requested as AppLocale) : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
