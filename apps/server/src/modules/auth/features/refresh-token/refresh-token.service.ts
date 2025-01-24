import { ForbiddenError, UnauthorizedError } from "@/errors";
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { RefreshDto } from "@modules/auth/dtos/refresh.dto";

import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _jwtService: IJwtService
  ) {}
  async refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto> {
    const { userId, token } = refreshDto;

    const decodedToken = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    if (decodedToken.userId !== userId) {
      await this._refreshTokenRepository.deleteAll(userId);

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const refreshTokenFromDB =
      await this._refreshTokenRepository.findValidToken(token);

    // Detected refresh token reuse!
    if (!refreshTokenFromDB) {
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
}
