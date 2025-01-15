import prismaClient from "../../config/database.config";
import { mailSenderService } from "../mailSender/mail-sender.module";
import { passwordService } from "../password/password.module";
import { userService } from "../user/user.module";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordRepository } from "./reset-password.repository";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordRepository = new ResetPasswordRepository(prismaClient);
const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
  userService,
  passwordService,
  mailSenderService
);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

export { resetPasswordController, resetPasswordService };
