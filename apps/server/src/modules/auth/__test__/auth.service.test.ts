import { mock, mockReset } from "jest-mock-extended";

import {
  AuthService,
  type ILogoutDto,
  type IRefreshTokenService,
} from "@/modules/auth";

describe("AuthService", () => {
  const refreshTokenService = mock<IRefreshTokenService>();

  const options = { refreshTokenService };

  beforeEach(() => {
    mockReset(refreshTokenService);

    // Reset singleton instance before each test to ensure a clean state.
    // @ts-ignore: resetting the private _instance for testing purposes
    AuthService._instance = undefined;
  });

  describe("Singleton behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = AuthService.getInstance(options);
      expect(instance).toBeInstanceOf(AuthService);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = AuthService.getInstance(options);
      const instance2 = AuthService.getInstance(options);
      expect(instance1).toBe(instance2);
    });
  });

  describe("logoutUser", () => {
    let authService: AuthService;

    const validLogoutDto: ILogoutDto = {
      userId: "user_id_001",
      refreshToken: "valid_refresh_token",
    };

    beforeEach(() => {
      authService = AuthService.getInstance(options);
    });

    it("should successfully logout a user when valid userId and refreshToken are provided", async () => {
      refreshTokenService.deleteAllTokens.mockResolvedValue(undefined);

      await authService.logoutUser(validLogoutDto);

      expect(refreshTokenService.deleteToken).toHaveBeenCalledWith(
        validLogoutDto.userId,
        validLogoutDto.refreshToken
      );

      expect(refreshTokenService.deleteToken).toHaveBeenCalledTimes(1);
    });

    it("should propagate errors thrown by refreshTokenService.deleteToken", async () => {
      const errorMessage = "Delete tokens failure";

      refreshTokenService.deleteToken.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(authService.logoutUser(validLogoutDto)).rejects.toThrow(
        errorMessage
      );

      expect(refreshTokenService.deleteToken).toHaveBeenCalledWith(
        validLogoutDto.userId,
        validLogoutDto.refreshToken
      );
    });
  });
});
