import { Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  phone: z.string().trim().min(8).max(20).optional(),
  role: z.nativeEnum(Role).refine((value) => value !== Role.ADMIN, {
    message: "Admin registration is not allowed from public API",
  }),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(8).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});
