import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { contactController } from "./contact.controller";
import { createContactSchema } from "./contact.validation";

const router = Router();

router.post("/", authenticate, validate(createContactSchema), asyncHandler(contactController.create));

export { router as contactRouter };
