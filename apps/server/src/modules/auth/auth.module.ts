import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { refreshTokenService } from "@modules/auth";

import { cacheService } from "@modules/shared";

const authService = new AuthService(refreshTokenService, cacheService);

const authController = new AuthController(authService);

export { authController, authService };
