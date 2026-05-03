import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = {
  sub: string;
  role: string;
  type: "access" | "refresh";
};

function signToken(
  payload: TokenPayload,
  secret: string,
  expiresIn: string,
) {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function signAccessToken(userId: string, role: string) {
  return signToken(
    { sub: userId, role, type: "access" },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
}

export function signRefreshToken(userId: string, role: string) {
  return signToken(
    { sub: userId, role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
