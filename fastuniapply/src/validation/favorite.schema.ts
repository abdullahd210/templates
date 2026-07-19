import { z } from "zod";
import { FavoriteEntityType } from "@prisma/client";

export const toggleFavoriteSchema = z.object({
  entityType: z.nativeEnum(FavoriteEntityType),
  entityId: z.string().min(1),
});
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
