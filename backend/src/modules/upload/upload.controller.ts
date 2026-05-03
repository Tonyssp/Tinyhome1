import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { uploadService } from "./upload.service";

export const uploadController = {
  async upload(req: Request, res: Response) {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const uploads = await uploadService.uploadImages(files, req.user!, req.body.listingId);

    return res.status(StatusCodes.CREATED).json({
      message: "Files uploaded successfully",
      data: uploads,
    });
  },
};
