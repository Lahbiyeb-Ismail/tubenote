import { Router } from "express";

import prismaClient from "../../lib/prisma";
import validateRequest from "../../middlewares/validateRequest";

import { EmailService } from "../../services/emailService";
import { PasswordService } from "../password/password.service";
import { UserDatabase } from "../user/user.db";
import { UserService } from "../user/user.service";
import { VerificationTokenDatabase } from "../verifyEmailToken/verification-token.db";
import { ResetPasswordTokenDatabase } from "./reset-password.db";
import { ResetPasswordService } from "./reset-password.service";

import { ResetPasswordController } from "./reset-password.controller";

import { emailBodySchema } from "../../common/schemas/email-body.schema";
import { tokenParamSchema } from "../../common/schemas/token-param.schema";
import { passwordBodySchema } from "./schemas/password-body.schema";

const resetTokenDB = new ResetPasswordTokenDatabase(prismaClient);
const userDB = new UserDatabase(prismaClient);
const verificationTokenDB = new VerificationTokenDatabase(prismaClient);

const passwordService = new PasswordService(userDB);
const userService = new UserService(userDB, passwordService);
const emailService = new EmailService(userDB, verificationTokenDB);
const resetPasswordService = new ResetPasswordService(
  resetTokenDB,
  userService,
  passwordService,
  emailService
);

const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

const router = Router();

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
