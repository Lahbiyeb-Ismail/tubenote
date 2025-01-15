import { googleAuthConfig } from "../../config/google-auth.config";
import { jwtService } from "../jwt/jwt.module";
import { mailSenderService } from "../mailSender/mail-sender.module";
import { passwordService } from "../password/password.module";
import { refreshTokenService } from "../refreshToken/refresh-token.module";
import { userService } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleAuthStrategy } from "./strategies/google.strategy";

const authService = new AuthService(
  jwtService,
  userService,
  passwordService,
  refreshTokenService,
  mailSenderService
);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const authController = new AuthController(authService);

export { authController, authService, googleAuthStrategy };
