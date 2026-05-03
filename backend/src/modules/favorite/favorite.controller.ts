import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { favoriteService } from "./favorite.service";

export const favoriteController = {
  async create(req: Request, res: Response) {
    const favorite = await favoriteService.addFavorite(req.user!.id, req.body.listingId);
    return res.status(StatusCodes.CREATED).json({
      message: "Listing saved to favorites",
      data: favorite,
    });
  },

  async list(req: Request, res: Response) {
    const favorites = await favoriteService.getFavorites(req.user!.id);
    return res.status(StatusCodes.OK).json({ data: favorites });
  },

  async remove(req: Request, res: Response) {
    await favoriteService.removeFavorite(req.user!.id, req.params.id as string);
    return res.status(StatusCodes.OK).json({
      message: "Listing removed from favorites",
    });
  },
};
