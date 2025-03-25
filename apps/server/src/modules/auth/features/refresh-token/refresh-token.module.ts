import { loggerService, prismaService } from "@/modules/shared/services";

import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshTokenService } from "./refresh-token.service";

import { jwtService } from "../../utils";

const refreshTokenRepository = RefreshTokenRepository.getInstance({
  db: prismaService,
});

const refreshTokenService = RefreshTokenService.getInstance({
  refreshTokenRepository,
  prismaService,
  jwtService,
  loggerService,
});

const refreshTokenController = RefreshTokenController.getInstance({
  refreshTokenService,
});

export { refreshTokenService, refreshTokenController };
