import prismaClient from "../../../config/database.config";
import { mailSenderService } from "../../mailSender/mail-sender.module";
import { passwordHasherService } from "../../password-hasher/password-hasher.module";
import { userRepository } from "../../user/user.module";
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
