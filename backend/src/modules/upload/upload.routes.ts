import { Router } from "express";
import multer from "multer";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { uploadController } from "./upload.controller";
import { uploadBodySchema } from "./upload.validation";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(Role.LANDLORD, Role.ADMIN),
  upload.array("files", 10),
  validate(uploadBodySchema),
  asyncHandler(uploadController.upload),
);

export { router as uploadRouter };
