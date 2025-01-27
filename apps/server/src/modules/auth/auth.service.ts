import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, UnauthorizedError } from "@/errors";
import logger from "@/utils/logger";

import type { IAuthService } from "./auth.types";

import type { IRefreshTokenService } from "./features/refresh-token/refresh-token.types";

import type { ICacheService } from "../utils/cache/cache.types";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { OAuthTemporaryCodePayloadDto } from "./dtos/oauth-temp-code-payload.dto";

export class AuthService implements IAuthService {
  constructor(
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cacheService: ICacheService
  ) {}

  async logoutUser(logoutUserDto: LogoutUserDto): Promise<void> {
    const { userId, refreshToken } = logoutUserDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }

  async exchangeOauthCodeForTokens(code: string): Promise<LoginResponseDto> {
    const codeData = this._cacheService.get<OAuthTemporaryCodePayloadDto>(code);

    logger.info(`Retrieved codeData: ${codeData}`);

    if (!codeData) {
      logger.error(`Code ${code} not found in cache`);
      throw new BadRequestError("Invalid or expired code");
    }

    const deleteResult = this._cacheService.del(code);

    logger.warn(`Deleted ${deleteResult} items from cache`);

    return {
      accessToken: codeData.accessToken,
      refreshToken: codeData.refreshToken,
    };
  }
}
