import { refreshTokenService } from "@modules/auth/refresh-token/refresh-token.module";
import { jwtService } from "@modules/jwt/jwt.module";

import { GoogleController } from "./google-auth.controller";
import { GoogleAuthService } from "./goole-auth.service";

const googleAuthService = new GoogleAuthService(
  jwtService,
  refreshTokenService
);
const googleAuthController = new GoogleController(googleAuthService);

export { googleAuthService, googleAuthController };
