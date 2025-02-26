import { userService } from "@modules/user";

import {
  cacheService,
  cryptoService,
  mailSenderService,
} from "@modules/shared";

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
