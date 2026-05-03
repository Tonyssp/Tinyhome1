import { ListingApprovalStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const contactService = {
  async createContact(userId: string, payload: { listingId: string; message: string }) {
    const listing = await prisma.listing.findUnique({
      where: { id: payload.listingId },
      select: {
        id: true,
        deletedAt: true,
        approvalStatus: true,
        landlordId: true,
      },
    });

    if (!listing || listing.deletedAt || listing.approvalStatus !== ListingApprovalStatus.APPROVED) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    if (listing.landlordId === userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You cannot contact your own listing");
    }

    return prisma.contact.create({
      data: {
        userId,
        listingId: payload.listingId,
        message: payload.message,
      },
      include: {
        listing: {
          select: { id: true, title: true, landlordId: true },
        },
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });
  },
};
