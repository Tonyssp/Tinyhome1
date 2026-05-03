import { z } from "zod";

export const createContactSchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().min(5).max(2000),
});
