import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

import { jwtService } from "@modules/auth/core/jwt/jwt.module";
import { refreshTokenService } from "@modules/auth/refresh-token/refresh-token.module";
import { mailSenderService } from "@modules/mailSender/mail-sender.module";
import { passwordHasherService } from "@modules/password-hasher/password-hasher.module";
import { userService } from "@modules/user/user.module";

const localAuthService = new LocalAuthService(
  jwtService,
  userService,
  passwordHasherService,
  refreshTokenService,
  mailSenderService
);

const localAuthController = new LocalAuthController(localAuthService);

export { localAuthService, localAuthController };
