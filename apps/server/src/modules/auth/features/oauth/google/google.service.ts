import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { stringToDate } from "@/modules/shared/utils";

import type { IJwtService } from "@/modules/auth/utils";
import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
} from "@/modules/shared/services";
import type { User } from "@/modules/user";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";
import type {
  OAuthCodePayloadDto,
  OAuthResponseDto,
} from "@/modules/auth/dtos";
import type { IRefreshTokenService } from "@/modules/auth/features";

import type { IGoogleAuthService } from "./google.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _cryptoService: ICryptoService,
    private readonly _cacheService: ICacheService,
    private readonly _loggerService: ILoggerService
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

    this._loggerService.info(`Code ${code} set in cache: ${setResult}`);
    this._loggerService.info(
      `Cache stats after set: ${this._cacheService.getStats()}`
    );

    return code;
  }
}
