import { Router } from "express";
import passport from "passport";

import envConfig from "../../config/env.config";

import isAuthenticated from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate-request.middleware";

import { authController, googleAuthStrategy } from "./auth.module";

import { emailBodySchema } from "../../common/schemas/email-body.schema";
import { tokenParamSchema } from "../../common/schemas/token-param.schema";
import { localAuthController } from "./local-auth/local-auth.module";
import { resetPasswordController } from "./reset-password/reset-password.module";
import { passwordBodySchema } from "./reset-password/schemas/password-body.schema";
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

// - POST /forgot-password: Initiate the password reset process (requires request body validation).
router
  .route("/forgot-password")
  .post(validateRequest({ body: emailBodySchema }), (req, res) =>
    resetPasswordController.forgotPassword(req, res)
  );

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
router
  .route("/reset-password/:token/verify")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    resetPasswordController.verifyResetToken(req, res)
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
router.route("/reset-password/:token").post(
  validateRequest({
    params: tokenParamSchema,
    body: passwordBodySchema,
  }),
  (req, res) => resetPasswordController.resetPassword(req, res)
);

export default router;
