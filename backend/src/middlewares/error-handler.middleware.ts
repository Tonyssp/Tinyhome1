import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 10MB or smaller"
        : error.code === "LIMIT_FILE_COUNT"
          ? "You can upload up to 10 images"
          : error.code === "LIMIT_UNEXPECTED_FILE"
            ? "Please upload images using the files field"
            : "Image upload failed";

    return res.status(StatusCodes.BAD_REQUEST).json({
      message,
      details: error.message,
    });
  }

  if (error instanceof Error && error.message === "Only image uploads are allowed") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }

  if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Database request failed",
      details: error.message,
    });
  }

  console.error(error);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
}
