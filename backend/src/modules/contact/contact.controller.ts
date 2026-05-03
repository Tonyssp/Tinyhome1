import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { contactService } from "./contact.service";

export const contactController = {
  async create(req: Request, res: Response) {
    const contact = await contactService.createContact(req.user!.id, req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Landlord contact request stored successfully",
      data: contact,
    });
  },
};
