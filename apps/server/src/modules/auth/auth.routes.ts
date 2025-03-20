import { Router } from "express";

import { isAuthenticated } from "@/middlewares";

import { authController } from "./auth.module";

import { localAuthRoutes } from "./features/local-auth";
import { refreshTokenRoutes } from "./features/refresh-token";
import { resetPasswordRoutes } from "./features/reset-password";
import { verifyEmailRoutes } from "./features/verify-email";

const authRoutes = Router();

// Local authentication routes
authRoutes.use("/", localAuthRoutes);

// Password reset routes
authRoutes.use("/", resetPasswordRoutes);

// Verify email routes
authRoutes.use("/", verifyEmailRoutes);

// Refresh token routes
authRoutes.use("/", refreshTokenRoutes);

// - POST /logout: Log out the current user.
authRoutes
  .route("/logout")
  .post(isAuthenticated, (req, res) => authController.logout(req, res));

export { authRoutes };
