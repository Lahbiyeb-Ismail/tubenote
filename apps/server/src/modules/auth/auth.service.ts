import { inject, injectable } from "inversify";

import { TYPES } from "@/config/inversify/types";

import type { IAuthService } from "./auth.types";
import type { ILogoutDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.RefreshTokenService)
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  async logoutUser(logoutDto: ILogoutDto): Promise<void> {
    const { userId, refreshToken } = logoutDto;

    await this._refreshTokenService.markTokenAsRevoked(
      userId,
      refreshToken,
      "user_logged_out"
    );
  }
}
