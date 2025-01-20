import { Router } from "express";

import isAuthenticated from "@middlewares/auth.middleware";

import { authController } from "./auth.module";

import refreshTokenRoutes from "./features/refresh-token/refresh-token.routes";
import resetPasswordRoutes from "./features/reset-password/reset-password.routes";
import verifyEmailRoutes from "./features/verify-email/verify-email.routes";
import localAuthRoutes from "./local-auth/local-auth.routes";
import googleAuthRoutes from "./social-auth/google-auth/google-auth.routes";

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

// - POST /logout: Log out the current user.
router
  .route("/logout")
  .post(isAuthenticated, (req, res) => authController.logout(req, res));

export default router;
