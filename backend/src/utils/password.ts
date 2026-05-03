import bcrypt from "bcryptjs";
import { env } from "../config/env";

export async function hashValue(value: string) {
  return bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS);
}

export async function compareValue(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
