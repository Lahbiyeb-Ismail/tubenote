import { cacheService, loggerService } from "@/modules/shared/services";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { refreshTokenService } from "./features";

const authService = new AuthService(
  refreshTokenService,
  cacheService,
  loggerService
);

const authController = new AuthController(authService);

export { authController, authService };
