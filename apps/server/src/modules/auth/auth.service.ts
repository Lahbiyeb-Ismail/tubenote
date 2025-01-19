import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { UnauthorizedError } from "@/errors";

import type { IAuthService } from "./auth.types";

import type { IRefreshTokenService } from "./refresh-token/refresh-token.types";

import type { LogoutUserDto } from "./dtos/logout-user.dto";

export class AuthService implements IAuthService {
  constructor(private readonly _refreshTokenService: IRefreshTokenService) {}

  async logoutUser(logoutUserDto: LogoutUserDto): Promise<void> {
    const { userId, refreshToken } = logoutUserDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }
}
