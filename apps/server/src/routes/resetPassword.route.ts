import { Router } from "express";

import validateRequest from "../middlewares/validateRequest";

import resetPasswordController from "../controllers/resetPasswordController";
import {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
} from "../schemas/resetPassword.schema";

const router = Router();

// - POST /forgot-password: Initiate the password reset process (requires request body validation).
router
  .route("/forgot-password")
  .post(
    validateRequest({ body: forgotPasswordBodySchema }),
    resetPasswordController.forgotPassword
  );

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
router
  .route("/reset-password/:token/verify")
  .get(
    validateRequest({ params: resetPasswordParamsSchema }),
    resetPasswordController.verifyResetToken
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
router.route("/reset-password/:token").post(
  validateRequest({
    params: resetPasswordParamsSchema,
    body: resetPasswordBodySchema,
  }),
  resetPasswordController.resetPassword
);

export default router;
