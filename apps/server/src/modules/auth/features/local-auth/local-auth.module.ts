import { userService } from "@/modules/user";

import { cryptoService, mailSenderService } from "@/modules/shared/services";

import { jwtService } from "../../utils";
import { refreshTokenService } from "../refresh-token";
import { verifyEmailService } from "../verify-email";

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
