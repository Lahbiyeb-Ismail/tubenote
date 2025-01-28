import { googleAuthConfig } from "@/modules/auth/config/google-auth.config";

import { userService } from "@/modules/user/user.module";
import { cacheService } from "@/modules/utils/cache/cache.module";
import { jwtService } from "@modules/auth/core/services/jwt/jwt.module";
import { refreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.module";

import { GoogleController } from "./google.controller";
import { GoogleAuthService } from "./google.service";
import { GoogleAuthStrategy } from "./google.strategy";

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

const googleAuthService = new GoogleAuthService(
  jwtService,
  refreshTokenService,
  cacheService
);

const googleAuthController = new GoogleController(googleAuthService);

export { googleAuthService, googleAuthController, googleAuthStrategy };
