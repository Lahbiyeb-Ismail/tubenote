import { Router } from "express";
import passport from "passport";

import envConfig from "../../config/env.config";

import isAuthenticated from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate-request.middleware";

import { authController, googleAuthStrategy } from "./auth.module";

import { localAuthController } from "./local-auth/local-auth.module";
import { loginUserSchema } from "./schemas/login-user.schema";
import { registerUserSchema } from "./schemas/register-user.schema";

passport.use(googleAuthStrategy.getStrategy());

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registerUserSchema }), (req, res) =>
    localAuthController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginUserSchema }), (req, res) =>
    localAuthController.login(req, res)
  );

// - POST /logout: Log out the current user.
router
  .route("/logout")
  .post(isAuthenticated, (req, res) => authController.logout(req, res));

// - POST /refresh: Refresh the user's access token.
router.route("/refresh").post((req, res) => authController.refresh(req, res));

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
