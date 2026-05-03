import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const userService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  },

  async updateMe(userId: string, payload: { fullName?: string; phone?: string | null }) {
    if (payload.phone) {
      const existingPhoneOwner = await prisma.user.findFirst({
        where: {
          phone: payload.phone,
          id: { not: userId },
        },
        select: { id: true },
      });

      if (existingPhoneOwner) {
        throw new ApiError(StatusCodes.CONFLICT, "Phone number already in use");
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        fullName: payload.fullName,
        phone: payload.phone === undefined ? undefined : payload.phone,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  },
};
