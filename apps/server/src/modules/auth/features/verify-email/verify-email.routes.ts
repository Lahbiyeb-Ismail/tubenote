import { Router } from "express";

import validateRequest from "@middlewares/validate-request.middleware";

import { tokenParamSchema } from "@/modules/shared";
import { verifyEmailController } from "./verify-email.module";

const router = Router();

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
router
  .route("/verify-email/:token")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    verifyEmailController.verifyEmail(req, res)
  );

export default router;
