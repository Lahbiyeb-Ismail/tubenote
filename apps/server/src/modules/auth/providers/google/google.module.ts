import { jwtService } from "@modules/auth/core/services/jwt/jwt.module";
import { refreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.module";

import { GoogleController } from "./google.controller";
import { GoogleAuthService } from "./google.service";

const googleAuthService = new GoogleAuthService(
  jwtService,
  refreshTokenService
);
const googleAuthController = new GoogleController(googleAuthService);

export { googleAuthService, googleAuthController };
