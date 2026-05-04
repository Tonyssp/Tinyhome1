import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize, optionalAuthenticate } from "../../middlewares/auth.middleware";
import { validate, validateQuery } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { listingController } from "./listing.controller";
import {
  createListingSchema,
  listListingsQuerySchema,
  updateListingSchema,
} from "./listing.validation";

const router = Router();

router.get("/amenities", asyncHandler(listingController.listAmenities));
router.get("/", optionalAuthenticate, validateQuery(listListingsQuerySchema), asyncHandler(listingController.list));
router.get("/:id", optionalAuthenticate, asyncHandler(listingController.getById));
router.post("/", authenticate, authorize(Role.USER, Role.LANDLORD, Role.ADMIN), validate(createListingSchema), asyncHandler(listingController.create));
router.put("/:id", authenticate, authorize(Role.USER, Role.LANDLORD, Role.ADMIN), validate(updateListingSchema), asyncHandler(listingController.update));
router.delete("/:id", authenticate, authorize(Role.USER, Role.LANDLORD, Role.ADMIN), asyncHandler(listingController.remove));

export { router as listingRouter };
