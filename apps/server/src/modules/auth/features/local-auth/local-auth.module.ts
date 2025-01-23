import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

import { jwtService } from "@modules/auth/core/services/jwt/jwt.module";
import { passwordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.module";
import { refreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.module";
import { verifyEmailService } from "@modules/auth/features/verify-email/verify-email.module";

import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { userService } from "@modules/user/user.module";

const localAuthService = new LocalAuthService(
  jwtService,
  userService,
  verifyEmailService,
  passwordHasherService,
  refreshTokenService,
  mailSenderService
);

const localAuthController = new LocalAuthController(localAuthService);

export { localAuthService, localAuthController };
