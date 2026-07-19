import { CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Deadline display that turns urgent (<= 30 days) so students notice it, without being alarmist beyond that. */
export function DeadlineDisplay({
  date,
  locale,
  label = "Deadline",
  className,
}: {
  date: Date | string | null | undefined;
  locale: AppLocale;
  label?: string;
  className?: string;
}) {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;
  const daysLeft = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft >= 0 && daysLeft <= 30;
  const isPast = daysLeft < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        isPast ? "text-muted-foreground" : isUrgent ? "font-medium text-accent" : "text-muted-foreground",
        className,
      )}
    >
      <CalendarClock className="h-3.5 w-3.5" />
      {label}: {formatDate(d, locale)}
      {isUrgent && !isPast && <span> · {daysLeft} days left</span>}
      {isPast && <span> · closed</span>}
    </span>
  );
}
