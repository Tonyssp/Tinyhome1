import { Role, ListingApprovalStatus, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const adminService = {
  async approveListing(id: string, adminId: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });

    if (!listing || listing.deletedAt) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    return prisma.listing.update({
      where: { id },
      data: {
        approvalStatus: ListingApprovalStatus.APPROVED,
        approvedAt: new Date(),
        approvedById: adminId,
      },
    });
  },

  async deleteListing(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });

    if (!listing || listing.deletedAt) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    await prisma.listing.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async banUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (user.role === Role.ADMIN) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Admin users cannot be banned from this endpoint");
    }

    return prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.BANNED,
        refreshTokenHash: null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
      },
    });
  },
};
