import prismaClient from "@config/database.config";

import { jwtService } from "@modules/auth/core/services/jwt/jwt.module";
import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { userService } from "@modules/user/user.module";

import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordRepository } from "./reset-password.repository";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordRepository = new ResetPasswordRepository(prismaClient);
const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
  userService,
  jwtService,
  mailSenderService
);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

export {
  resetPasswordController,
  resetPasswordService,
  resetPasswordRepository,
};
