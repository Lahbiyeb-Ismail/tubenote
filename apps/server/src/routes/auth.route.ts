import { Router } from "express";
import passport from "../lib/passportAuth";

import {
  handleGoogleLogin,
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleRegister,
} from "../controllers/auth.controller";

import { loginSchema, registrationSchema } from "../schemas/auth.schema";

import authController from "../controllers/authController";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registrationSchema }), authController.register);

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginSchema }), authController.login);

// - POST /logout: Log out the current user.
router.route("/logout").post(authController.logout);

// - POST /refresh: Refresh the user's access token.
router.route("/refresh").post(authController.refresh);

// - GET /google: Initiate Google OAuth authentication.
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// - GET /google/callback: Handle the Google OAuth callback.
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), handleGoogleLogin);

export default router;
