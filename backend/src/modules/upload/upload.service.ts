import { Role } from "@prisma/client";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
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

function bufferToDataUrl(file: Express.Multer.File) {
  const publicId = `data_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;

  return {
    secure_url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    public_id: publicId,
  };
}

export const uploadService = {
  async uploadImages(
    files: Express.Multer.File[],
    actor: Actor,
    listingId?: string,
    _publicOrigin?: string,
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
      console.error("Cloudinary upload failed. Falling back to database-backed image data.", error);
      uploaded = files.map((file) => bufferToDataUrl(file));
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
