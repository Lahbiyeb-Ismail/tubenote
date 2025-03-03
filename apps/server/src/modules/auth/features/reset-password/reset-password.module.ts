import { userService } from "@/modules/user";

import {
  cacheService,
  cryptoService,
  loggerService,
  mailSenderService,
} from "@/modules/shared/services";

import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordService = new ResetPasswordService(
  userService,
  cryptoService,
  cacheService,
  mailSenderService,
  loggerService
);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

export { resetPasswordController, resetPasswordService };
