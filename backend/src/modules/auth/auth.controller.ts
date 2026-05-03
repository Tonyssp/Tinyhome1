import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    authService.setRefreshCookie(res, result.refreshToken);

    return res.status(StatusCodes.CREATED).json({
      message: "Registration successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    authService.setRefreshCookie(res, result.refreshToken);

    return res.status(StatusCodes.OK).json({
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },

  async refresh(req: Request, res: Response) {
    const tokenFromCookie = req.cookies.refreshToken as string | undefined;
    const tokenFromBody = req.body.refreshToken as string | undefined;
    const result = await authService.refresh(tokenFromCookie ?? tokenFromBody);
    authService.setRefreshCookie(res, result.refreshToken);

    return res.status(StatusCodes.OK).json({
      message: "Token refreshed successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getMe(req.user!.id);

    return res.status(StatusCodes.OK).json({
      data: user,
    });
  },

  async logout(req: Request, res: Response) {
    if (req.user) {
      await authService.logout(req.user.id);
    }

    authService.clearRefreshCookie(res);

    return res.status(StatusCodes.OK).json({
      message: "Logged out successfully",
    });
  },
};
