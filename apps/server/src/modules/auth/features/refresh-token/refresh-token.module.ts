import { prismaClient } from "@modules/shared";

import { jwtService } from "@modules/auth";

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
