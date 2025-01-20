import prismaClient from "@config/database.config";

import { passwordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.module";
import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { userRepository } from "@modules/user/user.module";

import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordRepository } from "./reset-password.repository";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordRepository = new ResetPasswordRepository(prismaClient);
const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
  userRepository,
  passwordHasherService,
  mailSenderService
);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

export { resetPasswordController, resetPasswordService };
