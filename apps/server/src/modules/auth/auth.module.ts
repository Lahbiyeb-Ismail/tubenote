import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { googleAuthConfig } from "../../config/google-auth.config";
import { GoogleAuthStrategy } from "./strategies/google.strategy";

import { userService } from "../user/user.module";
import { refreshTokenService } from "./refresh-token/refresh-token.module";

const authService = new AuthService(refreshTokenService);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const authController = new AuthController(authService);

export { authController, authService, googleAuthStrategy };
