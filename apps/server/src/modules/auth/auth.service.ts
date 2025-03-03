import {
  BadRequestError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ICacheService, ILoggerService } from "@/modules/shared/services";

import type { IAuthService } from "./auth.types";
import type { IAuthResponseDto, ILogoutDto, OAuthCodePayloadDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

export class AuthService implements IAuthService {
  constructor(
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cacheService: ICacheService,
    private readonly _loggerService: ILoggerService
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

    this._loggerService.info(`Retrieved codeData: ${codeData}`);

    if (!codeData) {
      this._loggerService.error(`Code ${code} not found in cache`);
      throw new BadRequestError("Invalid or expired code");
    }

    const deleteResult = this._cacheService.del(code);

    this._loggerService.warn(`Deleted ${deleteResult} items from cache`);

    return {
      accessToken: codeData.accessToken,
      refreshToken: codeData.refreshToken,
    };
  }
}
