import { Role } from "@prisma/client";
import crypto from "crypto";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import streamifier from "streamifier";
import { cloudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

type Actor = {
  id: string;
  role: Role;
};

function uploadSingleBuffer(file: Express.Multer.File) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tiny-house-laos/listings",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

function getFileExtension(file: Express.Multer.File) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "image/gif") return ".gif";

  return ".jpg";
}

async function saveSingleBuffer(file: Express.Multer.File, publicOrigin: string) {
  const uploadDir = path.join(process.cwd(), "uploads", "listings");
  await fs.mkdir(uploadDir, { recursive: true });

  const publicId = `local_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
  const filename = `${publicId}${getFileExtension(file)}`;
  const fullPath = path.join(uploadDir, filename);

  await fs.writeFile(fullPath, file.buffer);

  return {
    secure_url: `${publicOrigin}/uploads/listings/${filename}`,
    public_id: publicId,
  };
}

export const uploadService = {
  async uploadImages(
    files: Express.Multer.File[],
    actor: Actor,
    listingId?: string,
    publicOrigin?: string,
  ) {
    if (!files.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "At least one file is required");
    }

    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, landlordId: true },
      });

      if (!listing) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
      }

      if (actor.role !== Role.ADMIN && actor.id !== listing.landlordId) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You cannot upload images for this listing");
      }
    }

    let uploaded: Array<{ secure_url: string; public_id: string }>;

    try {
      uploaded = await Promise.all(files.map((file) => uploadSingleBuffer(file)));
    } catch (error) {
      if (!publicOrigin) {
        throw error;
      }

      console.error("Cloudinary upload failed. Falling back to local uploads.", error);
      uploaded = await Promise.all(files.map((file) => saveSingleBuffer(file, publicOrigin)));
    }

    if (listingId) {
      await prisma.listingImage.createMany({
        data: uploaded.map((file, index) => ({
          listingId,
          imageUrl: file.secure_url,
          publicId: file.public_id,
          sortOrder: index,
        })),
      });
    }

    return uploaded.map((file) => ({
      imageUrl: file.secure_url,
      publicId: file.public_id,
    }));
  },
};
