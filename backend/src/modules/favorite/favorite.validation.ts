import { z } from "zod";

export const createFavoriteSchema = z.object({
  listingId: z.string().min(1),
});
