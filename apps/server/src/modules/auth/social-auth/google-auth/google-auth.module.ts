import { jwtService } from "../../../jwt/jwt.module";
import { refreshTokenService } from "../../refresh-token/refresh-token.module";
import { GoogleController } from "./google-auth.controller";
import { GoogleAuthService } from "./goole-auth.service";

const googleAuthService = new GoogleAuthService(
  jwtService,
  refreshTokenService
);
const googleAuthController = new GoogleController(googleAuthService);

export { googleAuthService, googleAuthController };
