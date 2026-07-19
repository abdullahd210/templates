import { z } from "zod";

/**
 * Shared building blocks for validating `searchParams` on listing pages.
 * Every directory (universities/programs/scholarships) parses its raw
 * `searchParams` object through one of these schemas before it ever reaches
 * a repository query — raw URL params are untrusted input (see
 * docs/05-technical-architecture.md §6) and Next.js's `searchParams` prop
 * gives us `string | string[] | undefined` per key with no guarantees.
 */

/** Coerces a possibly-array/undefined query value into a single trimmed string, or undefined. */
export const singleParam = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (Array.isArray(v) ? v[0] : v))
  .transform((v) => (v && v.trim() !== "" && v !== "all" ? v.trim() : undefined));

export const pageParam = singleParam
  .transform((v) => (v ? Number.parseInt(v, 10) : 1))
  .transform((v) => (Number.isFinite(v) && v > 0 ? Math.min(v, 1000) : 1));

export const booleanParam = singleParam.transform((v) => v === "true");

export const sortOptions = [
  "relevance",
  "name_asc",
  "tuition_asc",
  "tuition_desc",
  "newest",
  "deadline",
  "featured",
] as const;
export type SortOption = (typeof sortOptions)[number];

/** Same "never throw on a tampered value" rule as enumParam — an invalid sort just falls back to relevance. */
export const sortParam = singleParam.transform((v) =>
  v && (sortOptions as readonly string[]).includes(v) ? (v as SortOption) : "relevance",
);

/** Money amounts arrive from the URL as whole-currency-unit strings (e.g. "5000"); stored as minor units. */
export const moneyParam = singleParam.transform((v) => {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n * 100 : undefined;
});

/**
 * Validates a query value against a fixed set of allowed strings (typically
 * a Prisma enum's values), silently discarding anything else. A malformed
 * or tampered URL should degrade to "no filter applied", not a broken page —
 * this still satisfies "never trust raw URL params" since invalid values
 * never reach a repository/Prisma query.
 */
export function enumParam<T extends string>(allowed: readonly T[]) {
  return singleParam.transform((v) => (v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined));
}

export const intParam = singleParam.transform((v) => {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
});
