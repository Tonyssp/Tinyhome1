import { ListingApprovalStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const favoriteService = {
  async addFavorite(userId: string, listingId: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, deletedAt: true, approvalStatus: true },
    });

    if (!listing || listing.deletedAt || listing.approvalStatus !== ListingApprovalStatus.APPROVED) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    return prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
      update: {},
      create: {
        userId,
        listingId,
      },
      include: {
        listing: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });
  },

  async removeFavorite(userId: string, listingId: string) {
    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
  },

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
            amenities: {
              include: {
                amenity: true,
              },
            },
          },
        },
      },
    });
  },
};
