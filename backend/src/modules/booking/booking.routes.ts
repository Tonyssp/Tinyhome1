import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { bookingController } from "./booking.controller";
import { createBookingSchema, updateBookingSchema } from "./booking.validation";

const router = Router();

router.post("/", authenticate, authorize(Role.USER), validate(createBookingSchema), asyncHandler(bookingController.create));
router.get("/", authenticate, asyncHandler(bookingController.list));
router.put("/:id", authenticate, authorize(Role.LANDLORD, Role.ADMIN), validate(updateBookingSchema), asyncHandler(bookingController.update));

export { router as bookingRouter };
