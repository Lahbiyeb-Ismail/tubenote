import { Router } from "express";
import passport from "../../lib/passportAuth";

import { loginSchema, registrationSchema } from "./authValidationSchemas";

import AuthController from "./authController";

import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registrationSchema }), AuthController.register);

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginSchema }), AuthController.login);

// - POST /logout: Log out the current user.
router.route("/logout").post(AuthController.logout);

// - POST /refresh: Refresh the user's access token.
router.route("/refresh").post(AuthController.refresh);

// - GET /google: Initiate Google OAuth authentication.
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// - GET /google/callback: Handle the Google OAuth callback.
router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { session: false }),
    AuthController.loginWithGoogle
  );

export default router;
