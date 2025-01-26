import { NotFoundError, UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import type { IGoogleAuthService } from "./google.types";

import type { User } from "@modules/user/user.model";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/constants/auth.contants";
import { stringToDate } from "@/utils/convert-string-to-date";
import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  /**
   * Authenticates a user using Google OAuth and generates access and refresh tokens.
   * @param user - The user object retrieved from Google OAuth.
   * @returns A promise resolving to a LoginResponseDto containing access and refresh tokens.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedError if the user's email is not verified.
   */
  async googleLogin(user: User): Promise<LoginResponseDto> {
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

    return { accessToken, refreshToken };
  }
}
