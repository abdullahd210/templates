import { z } from "zod";
import { ComparisonEntityType } from "@prisma/client";

export const MAX_COMPARISON_ITEMS = 4;

export const saveComparisonSchema = z.object({
  entityType: z.nativeEnum(ComparisonEntityType),
  entityIds: z.array(z.string().min(1)).max(MAX_COMPARISON_ITEMS, `You can compare up to ${MAX_COMPARISON_ITEMS} items.`),
});
export type SaveComparisonInput = z.infer<typeof saveComparisonSchema>;
