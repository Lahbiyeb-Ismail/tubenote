import { v4 as uuidv4 } from "uuid";

import { NotFoundError, UnauthorizedError } from "@/errors";
import { REFRESH_TOKEN_EXPIRES_IN } from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";
import logger from "@utils/logger";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import { ICacheService } from "@modules/utils/cache/cache.types";
import { IGoogleAuthService } from "./google.types";

import type { User } from "@modules/user/user.model";

import type { OauthLoginResponseDto } from "@modules/auth/dtos/oauth-login-response.dto";
import type { OAuthTemporaryCodePayloadDto } from "@modules/auth/dtos/oauth-temp-code-payload.dto";
import type { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cacheService: ICacheService
  ) {}

  /**
   * Authenticates a user using Google OAuth and generates access and refresh tokens.
   * @param user - The user object retrieved from Google OAuth.
   * @returns A promise resolving to a LoginResponseDto containing access and refresh tokens.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedError if the user's email is not verified.
   */
  async googleLogin(user: User): Promise<OauthLoginResponseDto> {
    if (!user || !user.id) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const { isEmailVerified, id: userId } = user;

    if (!isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this._refreshTokenService.saveToken({
      userId,
      token: refreshToken,
      expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
    });

    // Generate a short-lived, one-time use code
    const temporaryCode = await this.generateTemporaryCode({
      userId,
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken, temporaryCode };
  }

  async generateTemporaryCode(
    temporaryCodePayloadDto: OAuthTemporaryCodePayloadDto
  ): Promise<string> {
    const code = uuidv4();

    const setResult = this._cacheService.set<OAuthTemporaryCodePayloadDto>(
      code,
      {
        ...temporaryCodePayloadDto,
      }
    );

    logger.info(`Code ${code} set in cache: ${setResult}`);
    logger.info(`Cache stats after set: ${this._cacheService.getStats()}`);

    return code;
  }
}
