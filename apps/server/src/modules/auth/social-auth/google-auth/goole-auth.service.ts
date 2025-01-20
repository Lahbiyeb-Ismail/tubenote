import { NotFoundError, UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { IJwtService } from "@modules/auth/core/jwt/jwt.types";
import type { IGoogleAuthService } from "./google-auth.types";

import type { User } from "@modules/user/user.model";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { IRefreshTokenService } from "@modules/auth/refresh-token/refresh-token.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  async googleLogin(user: User): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
      user.id
    );

    await this._refreshTokenService.createToken({
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
