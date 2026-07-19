import { formatMoney } from "@/lib/format";
import type { AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Consistent tuition/fee display used across university/program cards and
 * detail pages — handles the "discounted from X" pattern and the
 * "contact us" fallback for missing prices in one place.
 */
export function PriceDisplay({
  amountMinor,
  discountedAmountMinor,
  currency,
  locale,
  suffix,
  size = "default",
  className,
}: {
  amountMinor: number | null | undefined;
  discountedAmountMinor?: number | null;
  currency: string;
  locale: AppLocale;
  suffix?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  if (!amountMinor) {
    return <span className={cn("text-muted-foreground", className)}>Contact us</span>;
  }

  const sizeClass = size === "lg" ? "text-xl font-bold" : size === "sm" ? "text-sm font-semibold" : "text-base font-semibold";

  if (discountedAmountMinor && discountedAmountMinor < amountMinor) {
    return (
      <span className={cn("inline-flex flex-wrap items-baseline gap-1.5", className)}>
        <span className={cn(sizeClass, "text-primary")}>{formatMoney(discountedAmountMinor, currency, locale)}</span>
        <span className="text-xs text-muted-foreground line-through">{formatMoney(amountMinor, currency, locale)}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className={cn(sizeClass, "text-primary")}>{formatMoney(amountMinor, currency, locale)}</span>
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </span>
  );
}
