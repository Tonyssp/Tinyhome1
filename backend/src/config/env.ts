import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional().default(""),
  CLOUDINARY_API_KEY: z.string().min(1).optional().default(""),
  CLOUDINARY_API_SECRET: z.string().min(1).optional().default(""),
});

export const env = envSchema.parse(process.env);
