import { loggerService, prismaService } from "@/modules/shared/services";

import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshTokenService } from "./refresh-token.service";

import { jwtService } from "../../utils";

const refreshTokenRepository = new RefreshTokenRepository(prismaService);

const refreshTokenService = new RefreshTokenService(
  refreshTokenRepository,
  prismaService,
  jwtService,
  loggerService
);

const refreshTokenController = new RefreshTokenController(refreshTokenService);

export { refreshTokenService, refreshTokenController };
