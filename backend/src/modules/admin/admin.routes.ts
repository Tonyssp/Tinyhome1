import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { adminController } from "./admin.controller";

const router = Router();

router.put("/listings/:id/approve", authenticate, authorize(Role.ADMIN), asyncHandler(adminController.approveListing));
router.delete("/listings/:id", authenticate, authorize(Role.ADMIN), asyncHandler(adminController.deleteListing));
router.put("/users/:id/ban", authenticate, authorize(Role.ADMIN), asyncHandler(adminController.banUser));

export { router as adminRouter };
