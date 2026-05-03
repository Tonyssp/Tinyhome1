import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { listingService } from "./listing.service";

export const listingController = {
  async create(req: Request, res: Response) {
    const listing = await listingService.createListing(req.user!, req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Listing created successfully",
      data: listing,
    });
  },

  async list(req: Request, res: Response) {
    const result = await listingService.listListings(req.query as Parameters<typeof listingService.listListings>[0], req.user);
    return res.status(StatusCodes.OK).json(result);
  },

  async listAmenities(_req: Request, res: Response) {
    const amenities = await listingService.listAmenities();
    return res.status(StatusCodes.OK).json({ data: amenities });
  },

  async getById(req: Request, res: Response) {
    const listing = await listingService.getListingById(req.params.id as string, req.user);
    return res.status(StatusCodes.OK).json({ data: listing });
  },

  async update(req: Request, res: Response) {
    const listing = await listingService.updateListing(req.params.id as string, req.body, req.user!);
    return res.status(StatusCodes.OK).json({
      message: "Listing updated successfully",
      data: listing,
    });
  },

  async remove(req: Request, res: Response) {
    await listingService.deleteListing(req.params.id as string, req.user!);
    return res.status(StatusCodes.OK).json({
      message: "Listing deleted successfully",
    });
  },
};
