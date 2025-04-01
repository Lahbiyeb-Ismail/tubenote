import { Router } from "express";

import {
  emailBodySchema,
  passwordBodySchema,
  tokenParamSchema,
} from "@/modules/shared/schemas";

import { validateRequest } from "@/middlewares";
import { createRateLimitMiddleware } from "@/middlewares/rate-limit.middleware";
import { AUTH_RATE_LIMIT_CONFIG } from "../../config";
import { resetPasswordController } from "./reset-password.module";

const forgotPasswordRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `forgot-password:ip:${req.ip}`,
  rateLimitConfig: AUTH_RATE_LIMIT_CONFIG.forgotPassword,
});

const resetPasswordRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `reset-password:token:${req.params.token}`,
  rateLimitConfig: AUTH_RATE_LIMIT_CONFIG.resetPassword,
});

const resetPasswordRoutes = Router();

// - POST /forgot-password: Initiate the password reset process (requires request body validation).
resetPasswordRoutes
  .route("/forgot-password")
  .post(
    forgotPasswordRateLimiter,
    validateRequest({ body: emailBodySchema }),
    (req, res) => resetPasswordController.forgotPassword(req, res)
  );

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
resetPasswordRoutes
  .route("/reset-password/:token/verify")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    resetPasswordController.verifyResetToken(req, res)
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
resetPasswordRoutes.route("/reset-password/:token").post(
  resetPasswordRateLimiter,
  validateRequest({
    params: tokenParamSchema,
    body: passwordBodySchema,
  }),
  (req, res) => resetPasswordController.resetPassword(req, res)
);

export { resetPasswordRoutes };
