import { Router } from "express";

import {
  handleForgotPassword,
  handleResetPassword,
  handleResetPasswordTokenVerification,
} from "../controllers/resetPassword.controller";

import validateRequest from "../middlewares/validateRequest";
import { verifyPasswordResetToken } from "../middlewares/verifyPasswordResetToken";

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
    handleForgotPassword
  );

// Apply verifyPasswordResetToken middleware to all routes below
router.use(verifyPasswordResetToken);

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
router
  .route("/reset-password/:token/verify")
  .get(
    validateRequest({ params: resetPasswordParamsSchema }),
    handleResetPasswordTokenVerification
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
router.route("/reset-password/:token").post(
  validateRequest({
    params: resetPasswordParamsSchema,
    body: resetPasswordBodySchema,
  }),
  handleResetPassword
);

export default router;
