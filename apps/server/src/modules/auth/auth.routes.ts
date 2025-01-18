import { Router } from "express";
import passport from "passport";

import envConfig from "../../config/env.config";

import isAuthenticated from "../../middlewares/auth.middleware";

import { authController, googleAuthStrategy } from "./auth.module";

import localAuthRoutes from "./local-auth/local-auth.routes";
import refreshTokenRoutes from "./refresh-token/refresh-token.routes";
import resetPasswordRoutes from "./reset-password/reset-password.routes";
import verifyEmailRoutes from "./verify-email/verify-email.routes";

passport.use(googleAuthStrategy.getStrategy());

const router = Router();

// Local authentication routes
router.use("/", localAuthRoutes);

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

// - GET /google: Initiate Google OAuth authentication.
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// - GET /google/callback: Handle the Google OAuth callback.
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${envConfig.client.url}/login`,
  }),
  (req, res) => authController.loginWithGoogle(req, res)
);

export default router;
