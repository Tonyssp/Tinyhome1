import { StatusCodes } from "http-status-codes";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookies";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { compareValue, hashValue } from "../../utils/password";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
};

type LoginInput = {
  identifier: string;
  password: string;
};

async function createTokenPair(userId: string, role: Role) {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = signRefreshToken(userId, role);
  const refreshTokenHash = await hashValue(refreshToken);

  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(payload: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: payload.email },
          ...(payload.phone ? [{ phone: payload.phone }] : []),
        ],
      },
    });

    if (existing) {
      throw new ApiError(StatusCodes.CONFLICT, "User with this email or phone already exists");
    }

    const passwordHash = await hashValue(payload.password);

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        passwordHash,
        role: payload.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const tokens = await createTokenPair(user.id, user.role);

    return { user, ...tokens };
  },

  async login(payload: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: payload.identifier },
          { phone: payload.identifier },
        ],
      },
    });

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    if (user.status === UserStatus.BANNED) {
      throw new ApiError(StatusCodes.FORBIDDEN, "This account has been banned");
    }

    const passwordMatches = await compareValue(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const tokens = await createTokenPair(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  },

  async refresh(refreshTokenFromCookieOrBody?: string) {
    if (!refreshTokenFromCookieOrBody) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is required");
    }

    const payload = verifyRefreshToken(refreshTokenFromCookieOrBody);

    if (payload.type !== "refresh") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is not valid");
    }

    if (user.status === UserStatus.BANNED) {
      throw new ApiError(StatusCodes.FORBIDDEN, "This account has been banned");
    }

    const matches = await compareValue(refreshTokenFromCookieOrBody, user.refreshTokenHash);

    if (!matches) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is not valid");
    }

    const tokens = await createTokenPair(user.id, user.role);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    };
  },

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  },

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
      },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  },

  setRefreshCookie: setRefreshTokenCookie,
  clearRefreshCookie: clearRefreshTokenCookie,
};
