import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bookingService } from "./booking.service";

export const bookingController = {
  async create(req: Request, res: Response) {
    const booking = await bookingService.createBooking(req.user!, req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Viewing request created successfully",
      data: booking,
    });
  },

  async list(req: Request, res: Response) {
    const bookings = await bookingService.listBookings(req.user!);
    return res.status(StatusCodes.OK).json({ data: bookings });
  },

  async update(req: Request, res: Response) {
    const booking = await bookingService.updateBookingStatus(req.params.id as string, req.user!, req.body.status);
    return res.status(StatusCodes.OK).json({
      message: "Booking updated successfully",
      data: booking,
    });
  },
};
