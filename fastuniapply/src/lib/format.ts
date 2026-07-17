import type { AppLocale } from "@/i18n/config";

/** Formats an integer minor-unit amount (e.g. cents) as locale-aware currency. */
export function formatMoney(amountMinor: number, currency: string, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

export function formatDate(date: Date | string, locale: AppLocale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatNumber(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale).format(value);
}
