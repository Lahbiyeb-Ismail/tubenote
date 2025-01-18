import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";

import { jwtService } from "../../jwt/jwt.module";
import { mailSenderService } from "../../mailSender/mail-sender.module";
import { passwordHasherService } from "../../password-hasher/password-hasher.module";
import { userService } from "../../user/user.module";
import { refreshTokenService } from "../refresh-token/refresh-token.module";

const localAuthService = new LocalAuthService(
  jwtService,
  userService,
  passwordHasherService,
  refreshTokenService,
  mailSenderService
);

const localAuthController = new LocalAuthController(localAuthService);

export { localAuthService, localAuthController };
