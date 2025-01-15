import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

import { jwtService } from "../../jwt/jwt.module";
import { mailSenderService } from "../../mailSender/mail-sender.module";
import { passwordService } from "../../password/password.module";
import { refreshTokenService } from "../../refreshToken/refresh-token.module";
import { userService } from "../../user/user.module";

const localAuthService = new LocalAuthService(
  jwtService,
  userService,
  passwordService,
  refreshTokenService,
  mailSenderService
);

const localAuthController = new LocalAuthController(localAuthService);

export { localAuthService, localAuthController };
