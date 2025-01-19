import { Router } from "express";

import isAuthenticated from "@middlewares/auth.middleware";

import { authController } from "./auth.module";

import localAuthRoutes from "./local-auth/local-auth.routes";
import refreshTokenRoutes from "./refresh-token/refresh-token.routes";
import resetPasswordRoutes from "./reset-password/reset-password.routes";
import googleAuthRoutes from "./social-auth/google-auth/google-auth.routes";
import verifyEmailRoutes from "./verify-email/verify-email.routes";

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
