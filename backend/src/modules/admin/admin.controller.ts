import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminService } from "./admin.service";

export const adminController = {
  async approveListing(req: Request, res: Response) {
    const listing = await adminService.approveListing(req.params.id as string, req.user!.id);
    return res.status(StatusCodes.OK).json({
      message: "Listing approved successfully",
      data: listing,
    });
  },

  async deleteListing(req: Request, res: Response) {
    await adminService.deleteListing(req.params.id as string);
    return res.status(StatusCodes.OK).json({
      message: "Listing deleted successfully",
    });
  },

  async banUser(req: Request, res: Response) {
    const user = await adminService.banUser(req.params.id as string);
    return res.status(StatusCodes.OK).json({
      message: "User banned successfully",
      data: user,
    });
  },
};
