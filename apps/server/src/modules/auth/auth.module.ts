import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { refreshTokenService } from "@modules/auth";

import { cacheService, loggerService } from "@modules/shared";

const authService = new AuthService(
  refreshTokenService,
  cacheService,
  loggerService
);

const authController = new AuthController(authService);

export { authController, authService };
