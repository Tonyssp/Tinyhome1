import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { favoriteController } from "./favorite.controller";
import { createFavoriteSchema } from "./favorite.validation";

const router = Router();

router.post("/", authenticate, validate(createFavoriteSchema), asyncHandler(favoriteController.create));
router.get("/", authenticate, asyncHandler(favoriteController.list));
router.delete("/:id", authenticate, asyncHandler(favoriteController.remove));

export { router as favoriteRouter };
