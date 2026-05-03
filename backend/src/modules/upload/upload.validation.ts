import { z } from "zod";

export const uploadBodySchema = z.object({
  listingId: z.string().min(1).optional(),
});
