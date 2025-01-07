import { Router } from "express";

import { VerifyEmailController } from "./verify-email.controller";

import validateRequest from "../../middlewares/validateRequest";

import { emailBodySchema } from "../../common/schemas/email-body.schema";
import { tokenParamSchema } from "../../common/schemas/token-param.schema";
import prismaClient from "../../lib/prisma";
import { EmailService } from "../../services/emailService";
import { AuthService } from "../auth/auth.service";
import { PasswordService } from "../password/password.service";
import { UserDatabase } from "../user/user.db";
import { UserService } from "../user/user.service";
import { VerificationTokenDatabase } from "./verification-token.db";
import { VerifyEmailService } from "./verify-email.service";

const userDB = new UserDatabase(prismaClient);
const verificationTokenDB = new VerificationTokenDatabase(prismaClient);
const passwordService = new PasswordService();
const userService = new UserService(userDB, passwordService);
const emailService = new EmailService(userDB, verificationTokenDB);
const authService = new AuthService(
  userDB,
  userService,
  passwordService,
  emailService
);
const verifyEmailService = new VerifyEmailService(
  userDB,
  verificationTokenDB,
  authService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

const router = Router();

// - POST /send-verification-email: Send a verification email to the user (requires request body validation)
// router
//   .route("/send-verification-email")
//   .post(validateRequest({ body: emailBodySchema }), (req, res) =>
//     verifyEmailController.sendEmail(req, res)
//   );

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
router
  .route("/verify-email/:token")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    verifyEmailController.verifyEmail(req, res)
  );

export default router;
