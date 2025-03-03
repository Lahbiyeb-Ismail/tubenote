import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";
import { oauthCodeSchema } from "@/modules/shared/schemas";

import { authController } from "./auth.module";

import localAuthRoutes from "./features/local-auth/local-auth.routes";
import googleAuthRoutes from "./features/oauth/google/google.routes";
import refreshTokenRoutes from "./features/refresh-token/refresh-token.routes";
import resetPasswordRoutes from "./features/reset-password/reset-password.routes";
import verifyEmailRoutes from "./features/verify-email/verify-email.routes";

const router = Router();

// Local authentication routes
router.use("/", localAuthRoutes);

// Google authentication routes
router.use("/", googleAuthRoutes);

// Password reset routes
router.use("/", resetPasswordRoutes);

// Verify email routes
router.use("/", verifyEmailRoutes);

// Refresh token routes
router.use("/", refreshTokenRoutes);

router
  .route("/exchange-oauth-code")
  .post(validateRequest({ body: oauthCodeSchema }), (req, res) =>
    authController.exchangeOauthCodeForTokens(req, res)
  );

// - POST /logout: Log out the current user.
router
  .route("/logout")
  .post(isAuthenticated, (req, res) => authController.logout(req, res));

export default router;
