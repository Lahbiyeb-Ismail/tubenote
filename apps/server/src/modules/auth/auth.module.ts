import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { googleAuthConfig } from "../../config/google-auth.config";
import { GoogleAuthStrategy } from "./strategies/google.strategy";

import { jwtService } from "../jwt/jwt.module";
import { refreshTokenService } from "../refreshToken/refresh-token.module";
import { userService } from "../user/user.module";

const authService = new AuthService(
  jwtService,
  userService,
  refreshTokenService
);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const authController = new AuthController(authService);

export { authController, authService, googleAuthStrategy };
