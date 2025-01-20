import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { googleAuthConfig } from "@config/google-auth.config";
import { GoogleAuthStrategy } from "./core/strategies/google.strategy";

import { userService } from "@modules/user/user.module";
import { refreshTokenService } from "./features/refresh-token/refresh-token.module";

const authService = new AuthService(refreshTokenService);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const authController = new AuthController(authService);

export { authController, authService, googleAuthStrategy };
