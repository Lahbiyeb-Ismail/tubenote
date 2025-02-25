import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { refreshTokenService } from "@modules/auth";

import { cacheService } from "@modules/utils/cache/cache.module";

const authService = new AuthService(refreshTokenService, cacheService);

const authController = new AuthController(authService);

export { authController, authService };
