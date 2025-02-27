import { stringToDate } from "@utils/convert-string-to-date";

import { REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from "@modules/auth";
import type { IAuthResponseDto, IJwtService, IRefreshDto } from "@modules/auth";

import type { ICreateDto, ILoggerService } from "@/modules/shared";
import {
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from "@modules/shared";

import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _jwtService: IJwtService,
    private readonly _loggerService: ILoggerService
  ) {}

  async refreshToken(refreshDto: IRefreshDto): Promise<IAuthResponseDto> {
    const { userId, token } = refreshDto;

    const decodedToken = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    // Ensure the decoded token contains a valid userId
    if (
      typeof decodedToken.userId !== "string" ||
      decodedToken.userId !== userId
    ) {
      await this._refreshTokenRepository.deleteAll(userId);

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if the token exists in the database
    const refreshTokenFromDB =
      await this._refreshTokenRepository.findValidToken(token);

    // Detected refresh token reuse!
    if (!refreshTokenFromDB) {
      this._loggerService.warn(
        `Detected refresh token reuse for user ${userId}`
      );

      await this._refreshTokenRepository.deleteAll(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await this._refreshTokenRepository.delete(token);

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this._refreshTokenRepository.createToken({
      userId,
      data: {
        token: refreshToken,
        expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
      },
    });

    return { accessToken, refreshToken };
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }

  async createToken(
    createTokenDto: ICreateDto<RefreshToken>
  ): Promise<RefreshToken> {
    return await this._refreshTokenRepository.createToken(createTokenDto);
  }
}
