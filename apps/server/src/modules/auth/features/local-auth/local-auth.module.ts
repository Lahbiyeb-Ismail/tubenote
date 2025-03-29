import { userService } from "@/modules/user";

import {
  cryptoService,
  loggerService,
  mailSenderService,
  prismaService,
  rateLimitService,
  responseFormatter,
} from "@/modules/shared/services";

import { jwtService } from "../../utils";
import { refreshTokenService } from "../refresh-token";
import { verifyEmailService } from "../verify-email";

import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

const localAuthService = LocalAuthService.getInstance({
  prismaService,
  userService,
  verifyEmailService,
  refreshTokenService,
  jwtService,
  cryptoService,
  mailSenderService,
  rateLimitService,
  loggerService,
});

const localAuthController = LocalAuthController.getInstance({
  localAuthService,
  responseFormatter,
});

export { localAuthService, localAuthController };
