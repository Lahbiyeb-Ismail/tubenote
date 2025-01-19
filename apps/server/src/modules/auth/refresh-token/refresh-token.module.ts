import prismaClient from "@config/database.config";

import { jwtService } from "@modules/jwt/jwt.module";

import { RefreshTokenController } from "./refresh-token.controller";

import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshTokenService } from "./refresh-token.service";

const refreshTokenRepository = new RefreshTokenRepository(prismaClient);
const refreshTokenService = new RefreshTokenService(
  refreshTokenRepository,
  jwtService
);
const refreshTokenController = new RefreshTokenController(refreshTokenService);

export { refreshTokenService, refreshTokenController };
