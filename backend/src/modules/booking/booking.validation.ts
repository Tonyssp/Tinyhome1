import { BookingStatus } from "@prisma/client";
import { z } from "zod";

export const createBookingSchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
  preferredViewingAt: z.string().datetime().optional(),
});

export const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});
