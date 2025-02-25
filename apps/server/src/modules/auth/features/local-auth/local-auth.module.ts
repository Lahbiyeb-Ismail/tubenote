import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

import { refreshTokenService, verifyEmailService } from "@modules/auth";
import { jwtService } from "@modules/auth/utils/services/jwt/jwt.module";

import { userService } from "@modules/user";

import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { cryptoService } from "@modules/utils/crypto";

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
