import { userService } from "@/modules/user";

import {
  cryptoService,
  mailSenderService,
  prismaService,
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
});

const localAuthController = LocalAuthController.getInstance({
  localAuthService,
});

export { localAuthService, localAuthController };
