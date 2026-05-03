import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";

export const userController = {
  async getMe(req: Request, res: Response) {
    const user = await userService.getMe(req.user!.id);
    return res.status(StatusCodes.OK).json({ data: user });
  },

  async updateMe(req: Request, res: Response) {
    const user = await userService.updateMe(req.user!.id, req.body);
    return res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      data: user,
    });
  },
};
