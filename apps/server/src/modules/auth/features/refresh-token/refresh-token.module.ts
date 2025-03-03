import { prismaClient } from "@/modules/shared/config";
import { loggerService } from "@/modules/shared/services";

import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshTokenService } from "./refresh-token.service";

import { jwtService } from "../../utils";

const refreshTokenRepository = new RefreshTokenRepository(prismaClient);
const refreshTokenService = new RefreshTokenService(
  refreshTokenRepository,
  jwtService,
  loggerService
);
const refreshTokenController = new RefreshTokenController(refreshTokenService);

export { refreshTokenService, refreshTokenController };
