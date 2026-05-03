import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { userController } from "./user.controller";
import { updateProfileSchema } from "./user.validation";

const router = Router();

router.get("/me", authenticate, asyncHandler(userController.getMe));
router.put("/me", authenticate, validate(updateProfileSchema), asyncHandler(userController.updateMe));

export { router as userRouter };
