import { ForbiddenError, UnauthorizedError } from "@/errors";
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";
import logger from "@utils/logger";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";

import type { AuthResponseDto, RefreshDto } from "@modules/auth/dtos";

import type { SaveTokenDto } from "./dtos/save-token.dto";
import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _jwtService: IJwtService
  ) {}
  async refreshToken(refreshDto: RefreshDto): Promise<AuthResponseDto> {
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
      logger.warn(`Detected refresh token reuse for user ${userId}`);

      await this._refreshTokenRepository.deleteAll(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await this._refreshTokenRepository.delete(token);

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this._refreshTokenRepository.saveToken({
      userId,
      token: refreshToken,
      expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
    });

    return { accessToken, refreshToken };
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }

  async saveToken(saveTokenDto: SaveTokenDto): Promise<RefreshToken> {
    return await this._refreshTokenRepository.saveToken(saveTokenDto);
  }
}
