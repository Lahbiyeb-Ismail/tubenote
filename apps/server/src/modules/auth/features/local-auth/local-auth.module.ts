import {
  jwtService,
  refreshTokenService,
  verifyEmailService,
} from "@modules/auth";
import { userService } from "@modules/user";

import { cryptoService, mailSenderService } from "@modules/shared";

import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

const localAuthService = new LocalAuthService(
  jwtService,
  userService,
  verifyEmailService,
  cryptoService,
  refreshTokenService,
  mailSenderService
);

const localAuthController = new LocalAuthController(localAuthService);

export { localAuthService, localAuthController };
