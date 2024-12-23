import { Router } from "express";

import VerifyEmailController from "./verifyEmailController";

import validateRequest from "../../middlewares/validateRequest";

import {
  sendVerifyEmailBodySchema,
  verifyEmailParamSchema,
} from "./verifyEmailValidationSchemas";

const router = Router();

// - POST /send-verification-email: Send a verification email to the user (requires request body validation)
router
  .route("/send-verification-email")
  .post(
    validateRequest({ body: sendVerifyEmailBodySchema }),
    VerifyEmailController.sendEmail
  );

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
router
  .route("/verify-email/:token")
  .get(
    validateRequest({ params: verifyEmailParamSchema }),
    VerifyEmailController.verifyEmail
  );

export default router;
