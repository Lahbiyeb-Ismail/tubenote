import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { googleAuthConfig } from "./config/google-auth.config";
import { GoogleAuthStrategy } from "./providers/google/google.strategy";

import { userService } from "@modules/user/user.module";
import { cacheService } from "@modules/utils/cache/cache.module";
import { refreshTokenService } from "./features/refresh-token/refresh-token.module";

const authService = new AuthService(refreshTokenService, cacheService);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const authController = new AuthController(authService);

export { authController, authService, googleAuthStrategy };
