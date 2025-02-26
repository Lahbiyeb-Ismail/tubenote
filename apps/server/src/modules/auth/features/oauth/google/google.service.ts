import { UnauthorizedError } from "@modules/shared";

import { ERROR_MESSAGES } from "@modules/shared";

import { stringToDate } from "@utils/convert-string-to-date";
import logger from "@utils/logger";

import { ICacheService, ICryptoService } from "@modules/shared";

import type { User } from "@modules/user";

import type {
  IJwtService,
  IRefreshTokenService,
  OAuthCodePayloadDto,
  OAuthResponseDto,
} from "@modules/auth";

import { REFRESH_TOKEN_EXPIRES_IN } from "../../../constants";
import { IGoogleAuthService } from "./google.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cryptoService: ICryptoService,
    private readonly _cacheService: ICacheService
  ) {}

  /**
   * Authenticates a user using Google OAuth and generates access and refresh tokens.
   * @param user - The user object retrieved from Google OAuth.
   * @returns A promise resolving to a IAuthResponseDto containing access and refresh tokens.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedError if the user's email is not verified.
   */
  async googleLogin(user: User): Promise<OAuthResponseDto> {
    const { isEmailVerified, id: userId } = user;

    if (!isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED);
    }

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this._refreshTokenService.createToken({
      userId,
      data: {
        token: refreshToken,
        expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
      },
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
    temporaryCodePayloadDto: OAuthCodePayloadDto
  ): Promise<string> {
    const code = this._cryptoService.generateRandomSecureToken();

    const setResult = this._cacheService.set<OAuthCodePayloadDto>(code, {
      ...temporaryCodePayloadDto,
    });

    logger.info(`Code ${code} set in cache: ${setResult}`);
    logger.info(`Cache stats after set: ${this._cacheService.getStats()}`);

    return code;
  }
}
