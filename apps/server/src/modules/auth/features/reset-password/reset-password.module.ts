import { userService } from "@/modules/user";

import {
  cacheService,
  cryptoService,
  loggerService,
  mailSenderService,
  rateLimitService,
  responseFormatter,
} from "@/modules/shared/services";

import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";

const resetPasswordService = ResetPasswordService.getInstance({
  userService,
  cryptoService,
  cacheService,
  mailSenderService,
  loggerService,
});
const resetPasswordController = ResetPasswordController.getInstance({
  resetPasswordService,
  responseFormatter,
  rateLimitService,
  loggerService,
});

export { resetPasswordController, resetPasswordService };
