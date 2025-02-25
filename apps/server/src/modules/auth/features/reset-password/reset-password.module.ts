import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { userService } from "@modules/user";

import { cacheService } from "@/modules/utils/cache/cache.module";
import { cryptoService } from "@/modules/utils/crypto";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordService = new ResetPasswordService(
  userService,
  cryptoService,
  cacheService,
  mailSenderService
);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

export { resetPasswordController, resetPasswordService };
