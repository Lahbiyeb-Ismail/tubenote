import { userService } from "@/modules/user";
import {
  googleAuthConfig,
  jwtService,
  refreshTokenService,
} from "@modules/auth";

import { cacheService, cryptoService, loggerService } from "@modules/shared";

import { GoogleController } from "./google.controller";
import { GoogleAuthService } from "./google.service";
import { GoogleAuthStrategy } from "./google.strategy";

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const googleAuthService = new GoogleAuthService(
  jwtService,
  refreshTokenService,
  cryptoService,
  cacheService,
  loggerService
);

const googleAuthController = new GoogleController(googleAuthService);

export { googleAuthService, googleAuthController, googleAuthStrategy };
