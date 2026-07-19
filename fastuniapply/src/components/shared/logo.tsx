import { cn } from "@/lib/utils";

/**
 * Brand mark: a rounded chat-bubble outline (deep blue) with an orange
 * lightning bolt — "fast, personal guidance." Matches the identity used in
 * FastUniApply's marketing materials. Kept as a standalone icon so it can be
 * used without the wordmark (favicons, compact nav, app icons).
 */
export function LogoMark({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "inverted";
}) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 6.5h20a7.5 7.5 0 0 1 7.5 7.5v8a7.5 7.5 0 0 1-7.5 7.5H17.5L9 33v-3.5H8A7.5 7.5 0 0 1 .5 22v-8A7.5 7.5 0 0 1 8 6.5Z"
        className={variant === "inverted" ? "stroke-white" : "stroke-primary"}
        strokeWidth="2.5"
      />
      <path d="M22 11 11.5 23.5h6.3L16 33l11.5-13.5h-6.4L22 11Z" className="fill-accent" />
    </svg>
  );
}

export function Logo({
  className,
  iconClassName,
  wordmarkClassName,
  variant = "default",
}: {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  /** Use "inverted" on dark backgrounds (e.g. the navy footer). */
  variant?: "default" | "inverted";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark variant={variant} className={cn("h-7 w-7 shrink-0", iconClassName)} />
      <span className={cn("font-display text-lg font-bold", wordmarkClassName)}>
        <span className={variant === "inverted" ? "text-white" : "text-primary"}>Fast</span>
        <span className="text-accent">UniApply</span>
      </span>
    </span>
  );
}
