import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IAuthService } from "./auth.types";
import type { ILogoutDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

export class AuthService implements IAuthService {
  constructor(private readonly _refreshTokenService: IRefreshTokenService) {}

  async logoutUser(logoutDto: ILogoutDto): Promise<void> {
    const { userId, refreshToken } = logoutDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }
}
