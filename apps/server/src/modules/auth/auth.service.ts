import type { IAuthService, IAuthServiceOptions } from "./auth.types";
import type { ILogoutDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

export class AuthService implements IAuthService {
  private static _instance: AuthService;

  private constructor(
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  /**
   * Retrieves the singleton instance of the `AuthService` class.
   * If the instance does not already exist, it creates a new one
   * using the provided options.
   *
   * @param options - Configuration options required to initialize the `AuthService`.
   * @returns The singleton instance of the `AuthService`.
   */
  public static getInstance(options: IAuthServiceOptions): AuthService {
    if (!this._instance) {
      this._instance = new AuthService(options.refreshTokenService);
    }
    return this._instance;
  }

  async logoutUser(logoutDto: ILogoutDto): Promise<void> {
    const { userId, refreshToken } = logoutDto;

    await this._refreshTokenService.deleteToken(userId, refreshToken);
  }
}
