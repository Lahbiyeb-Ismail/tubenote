import { Router } from "express";
import passport from "../../lib/passportAuth";
import prismaClient from "../../lib/prisma";

import { UserDatabase } from "../user/user.db";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import { EmailService } from "../../services/emailService";
import { JwtService } from "../jwt/jwt.service";
import { PasswordService } from "../password/password.service";
import { RefreshTokenDatabase } from "../refreshToken/refresh-token.db";
import { RefreshTokenService } from "../refreshToken/refresh-token.service";
import { UserService } from "../user/user.service";
import { VerificationTokenDatabase } from "../verifyEmailToken/verification-token.db";
import { loginUserSchema } from "./schemas/login-user.schema";
import { registerUserSchema } from "./schemas/register-user.schema";

const userDB = new UserDatabase(prismaClient);
const refreshTokenDB = new RefreshTokenDatabase(prismaClient);
const verificationTokenDB = new VerificationTokenDatabase(prismaClient);

const jwtService = new JwtService();
const passwordService = new PasswordService(userDB);
const userService = new UserService(userDB, passwordService);
const refreshTokenService = new RefreshTokenService(refreshTokenDB);
const emailService = new EmailService(userDB, verificationTokenDB);

const authService = new AuthService(
  jwtService,
  userService,
  passwordService,
  refreshTokenService,
  emailService
);
const authController = new AuthController(authService);

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registerUserSchema }), (req, res) =>
    authController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginUserSchema }), (req, res) =>
    authController.login(req, res)
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
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), (req, res) =>
    authController.loginWithGoogle(req, res)
  );

export default router;
