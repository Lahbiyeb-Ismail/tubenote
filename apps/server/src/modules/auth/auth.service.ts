import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, UnauthorizedError } from "@/errors";
import logger from "@/utils/logger";

import type { ICacheService } from "@modules/shared";

import type {
  IAuthResponseDto,
  IAuthService,
  ILogoutDto,
  IRefreshTokenService,
  OAuthCodePayloadDto,
} from "@modules/auth";

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
