import { userService } from "@/modules/user";

import {
  cacheService,
  cryptoService,
  loggerService,
} from "@/modules/shared/services";

import { googleAuthConfig } from "../../../config";

import { jwtService } from "../../../utils";
import { refreshTokenService } from "../../refresh-token";

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
