import { mock, mockReset } from "jest-mock-extended";

import {
  AuthService,
  type ILogoutDto,
  type IRefreshTokenService,
} from "@/modules/auth";
import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

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

      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        validLogoutDto.userId
      );

      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledTimes(1);
    });

    it("should throw an UnauthorizedError if refreshToken is missing", async () => {
      const logoutDto = {
        userId: "user_id_001",
        refreshToken: "",
      };

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        UnauthorizedError
      );

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        ERROR_MESSAGES.UNAUTHORIZED
      );

      expect(refreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });

    it("should throw an UnauthorizedError if userId is missing", async () => {
      const logoutDto = {
        userId: "",
        refreshToken: "valid_refresh_token",
      };

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        UnauthorizedError
      );

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        ERROR_MESSAGES.UNAUTHORIZED
      );

      expect(refreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });

    it("should throw an UnauthorizedError if both userId and refreshToken are missing", async () => {
      const logoutDto = {
        userId: "",
        refreshToken: "",
      };

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        UnauthorizedError
      );

      await expect(authService.logoutUser(logoutDto)).rejects.toThrow(
        ERROR_MESSAGES.UNAUTHORIZED
      );

      expect(refreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });

    it("should propagate errors thrown by refreshTokenService.deleteAllTokens", async () => {
      const errorMessage = "Delete tokens failure";

      refreshTokenService.deleteAllTokens.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(authService.logoutUser(validLogoutDto)).rejects.toThrow(
        errorMessage
      );
      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        validLogoutDto.userId
      );
    });
  });
});
