import { BookingStatus, ListingApprovalStatus, Prisma, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

type Actor = {
  id: string;
  role: Role;
};

export const bookingService = {
  async createBooking(actor: Actor, payload: { listingId: string; message?: string; preferredViewingAt?: string }) {
    const listing = await prisma.listing.findUnique({
      where: { id: payload.listingId },
      select: {
        id: true,
        landlordId: true,
        approvalStatus: true,
        deletedAt: true,
      },
    });

    if (!listing || listing.deletedAt || listing.approvalStatus !== ListingApprovalStatus.APPROVED) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    if (actor.id === listing.landlordId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Landlords cannot book their own listings");
    }

    return prisma.booking.create({
      data: {
        userId: actor.id,
        listingId: payload.listingId,
        message: payload.message,
        preferredViewingAt: payload.preferredViewingAt ? new Date(payload.preferredViewingAt) : undefined,
      },
      include: {
        listing: true,
      },
    });
  },

  async listBookings(actor: Actor) {
    const where: Prisma.BookingWhereInput =
      actor.role === Role.ADMIN
        ? {}
        : actor.role === Role.LANDLORD
          ? { listing: { landlordId: actor.id } }
          : { userId: actor.id };

    return prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        listing: {
          select: { id: true, title: true, city: true, district: true, landlordId: true },
        },
      },
    });
  },

  async updateBookingStatus(id: string, actor: Actor, status: BookingStatus) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: { landlordId: true },
        },
      },
    });

    if (!booking) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
    }

    if (actor.role !== Role.ADMIN && actor.id !== booking.listing.landlordId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to update this booking");
    }

    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
        listing: {
          select: { id: true, title: true },
        },
      },
    });
  },
};
