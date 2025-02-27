import { BadRequestError } from "@modules/shared";

import type { ICacheService, ILoggerService } from "@modules/shared";

import {
  AuthService,
  ILogoutDto,
  IRefreshTokenService,
  OAuthCodePayloadDto,
} from "@modules/auth";

describe("AuthService", () => {
  let authService: AuthService;
  let mockRefreshTokenService: jest.Mocked<IRefreshTokenService>;
  let mockCacheService: jest.Mocked<ICacheService>;
  let mockLoggerService: jest.Mocked<ILoggerService>;

  beforeEach(() => {
    mockRefreshTokenService = {
      deleteAllTokens: jest.fn(),
      refreshToken: jest.fn(),
      createToken: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      flush: jest.fn(),
      getStats: jest.fn(),
    };

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    };

    authService = new AuthService(
      mockRefreshTokenService,
      mockCacheService,
      mockLoggerService
    );
  });

  describe("AuthService - logoutUser", () => {
    const validLogoutDto: ILogoutDto = {
      userId: "user-123",
      refreshToken: "refresh-token-123",
    };

    it("should successfully logout user and delete all refresh tokens", async () => {
      mockRefreshTokenService.deleteAllTokens.mockResolvedValue();

      await authService.logoutUser(validLogoutDto);

      expect(mockRefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        validLogoutDto.userId
      );
    });

    it("should handle errors from refresh token service", async () => {
      mockRefreshTokenService.deleteAllTokens.mockRejectedValue(
        new Error("Database error")
      );

      await expect(authService.logoutUser(validLogoutDto)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("AuthService - exchangeOauthCodeForTokens", () => {
    const mockCode = "valid-code-123";

    const mockCodeData: OAuthCodePayloadDto = {
      userId: "user-123",
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
    };

    it("should successfully exchange code for tokens and delete the code from cache", async () => {
      mockCacheService.get.mockReturnValue(mockCodeData);
      mockCacheService.del.mockReturnValue(1);

      const result = await authService.exchangeOauthCodeForTokens(mockCode);

      expect(result).toEqual({
        accessToken: mockCodeData.accessToken,
        refreshToken: mockCodeData.refreshToken,
      });

      expect(mockCacheService.get).toHaveBeenCalledWith(mockCode);

      expect(mockCacheService.del).toHaveBeenCalledWith(mockCode);
    });

    it("should throw BadRequestError if code is not found in cache", async () => {
      mockCacheService.get.mockReturnValue(null);

      await expect(
        authService.exchangeOauthCodeForTokens(mockCode)
      ).rejects.toThrow(new BadRequestError("Invalid or expired code"));

      expect(mockCacheService.del).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if code data is undefined", async () => {
      mockCacheService.get.mockReturnValue(undefined);

      await expect(
        authService.exchangeOauthCodeForTokens(mockCode)
      ).rejects.toThrow(new BadRequestError("Invalid or expired code"));

      expect(mockCacheService.del).not.toHaveBeenCalled();
    });

    it("should handle cache deletion failure", async () => {
      mockCacheService.get.mockReturnValue(mockCodeData);
      mockCacheService.del.mockImplementation(() => {
        throw new Error("Cache deletion failed");
      });

      await expect(
        authService.exchangeOauthCodeForTokens(mockCode)
      ).rejects.toThrow("Cache deletion failed");
    });

    it("should handle cache retrieval errors", async () => {
      mockCacheService.get.mockImplementation(() => {
        throw new Error("Cache retrieval failed");
      });

      await expect(
        authService.exchangeOauthCodeForTokens(mockCode)
      ).rejects.toThrow("Cache retrieval failed");
    });

    it("should handle empty code parameter", async () => {
      await expect(authService.exchangeOauthCodeForTokens("")).rejects.toThrow(
        new BadRequestError("Invalid or expired code")
      );

      expect(mockCacheService.get).toHaveBeenCalledWith("");
      expect(mockCacheService.del).not.toHaveBeenCalled();
    });

    it("should handle malformed code data in cache", async () => {
      mockCacheService.get.mockReturnValue({
        invalidData: "malformed",
      } as any);

      const result = await authService.exchangeOauthCodeForTokens(mockCode);

      expect(result).toEqual({
        accessToken: undefined,
        refreshToken: undefined,
      });
      expect(mockCacheService.del).toHaveBeenCalledWith(mockCode);
    });

    it("should handle zero deletion count", async () => {
      mockCacheService.get.mockReturnValue(mockCodeData);
      mockCacheService.del.mockReturnValue(0);

      const result = await authService.exchangeOauthCodeForTokens(mockCode);

      expect(result).toEqual({
        accessToken: mockCodeData.accessToken,
        refreshToken: mockCodeData.refreshToken,
      });
    });
  });
});
