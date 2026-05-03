import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";

async function resolveUserFromAuthorizationHeader(authorization?: string) {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length);
  const payload = verifyAccessToken(token);

  if (payload.type !== "access") {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, status: true },
  });

  if (!user || user.status === UserStatus.BANNED) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User is not allowed to access this resource");
  }

  return {
    id: user.id,
    role: user.role,
  };
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Missing or invalid authorization header"));
  }

  req.user = (await resolveUserFromAuthorizationHeader(req.headers.authorization)) ?? undefined;

  next();
}

export async function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    req.user = (await resolveUserFromAuthorizationHeader(req.headers.authorization)) ?? undefined;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to perform this action"));
    }

    next();
  };
}
