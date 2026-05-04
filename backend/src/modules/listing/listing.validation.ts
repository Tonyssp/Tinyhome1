import { ListingApprovalStatus, ListingAvailabilityStatus, ListingType } from "@prisma/client";
import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().trim().min(5).max(180),
  description: z.string().trim().min(5).max(5000),
  price: z.coerce.number().positive(),
  deposit: z.coerce.number().min(0),
  city: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(120),
  village: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(255),
  type: z.nativeEnum(ListingType),
  availabilityStatus: z.nativeEnum(ListingAvailabilityStatus).optional(),
  amenityIds: z.array(z.string().min(1)).min(1),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        publicId: z.string().min(1),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .min(1),
});

export const updateListingSchema = createListingSchema.partial().extend({
  approvalStatus: z.nativeEnum(ListingApprovalStatus).optional(),
});

export const listListingsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  keyword: z.string().trim().optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  amenities: z.string().trim().optional(),
  type: z.nativeEnum(ListingType).optional(),
  sortBy: z.enum(["price_asc", "newest", "rating"]).optional(),
  myListings: z.coerce.boolean().optional(),
});
