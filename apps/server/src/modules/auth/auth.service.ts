import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, UnauthorizedError } from "@/errors";
import logger from "@/utils/logger";

import type { IRefreshTokenService } from "@modules/auth";

import type { IAuthService } from "./auth.types";

import type { ICacheService } from "../utils/cache/cache.types";
import type { IAuthResponseDto, ILogoutDto, OAuthCodePayloadDto } from "./dtos";

export class AuthService implements IAuthService {
  constructor(
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cacheService: ICacheService
  ) {}

  async logoutUser(logoutDto: ILogoutDto): Promise<void> {
    const { userId, refreshToken } = logoutDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }

  async exchangeOauthCodeForTokens(code: string): Promise<IAuthResponseDto> {
    const codeData = this._cacheService.get<OAuthCodePayloadDto>(code);

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
