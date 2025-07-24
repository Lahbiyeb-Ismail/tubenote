import { mock, mockReset } from "jest-mock-extended";

import type { ILogoutDto, IRefreshTokenService } from "@/modules/auth";

import {
  AuthService,

} from "@/modules/auth";

describe("authService", () => {
  const refreshTokenService = mock<IRefreshTokenService>();

  beforeEach(() => {
    mockReset(refreshTokenService);
  });

  describe("logoutUser", () => {
    let authService: AuthService;

    const validLogoutDto: ILogoutDto = {
      userId: "user_id_001",
      refreshToken: "valid_refresh_token",
    };

    beforeEach(() => {
      authService = new AuthService(refreshTokenService);
    });

    it("should successfully logout a user when valid userId and refreshToken are provided", async () => {
      refreshTokenService.deleteAllTokens.mockResolvedValue(undefined);

      await authService.logoutUser(validLogoutDto);

      expect(refreshTokenService.deleteToken).toHaveBeenCalledWith(
        validLogoutDto.userId,
        validLogoutDto.refreshToken,
      );

      expect(refreshTokenService.deleteToken).toHaveBeenCalledTimes(1);
    });

    it("should propagate errors thrown by refreshTokenService.deleteToken", async () => {
      const errorMessage = "Delete tokens failure";

      refreshTokenService.deleteToken.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(authService.logoutUser(validLogoutDto)).rejects.toThrow(
        errorMessage,
      );

      expect(refreshTokenService.deleteToken).toHaveBeenCalledWith(
        validLogoutDto.userId,
        validLogoutDto.refreshToken,
      );
    });
  });
});
