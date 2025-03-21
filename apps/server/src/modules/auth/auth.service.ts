import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IAuthService, IAuthServiceOptions } from "./auth.types";
import type { ILogoutDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

export class AuthService implements IAuthService {
  private static instance: AuthService;
  private readonly _refreshTokenService: IRefreshTokenService;

  constructor(options: IAuthServiceOptions) {
    this._refreshTokenService = options.refreshTokenService;
  }

  /**
   * Retrieves the singleton instance of the `AuthService` class.
   * If the instance does not already exist, it creates a new one
   * using the provided options.
   *
   * @param options - Configuration options required to initialize the `AuthService`.
   * @returns The singleton instance of the `AuthService`.
   */
  static getInstance(options: IAuthServiceOptions): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(options);
    }
    return AuthService.instance;
  }

  async logoutUser(logoutDto: ILogoutDto): Promise<void> {
    const { userId, refreshToken } = logoutDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }
}
