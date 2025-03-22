import { mock, mockReset } from "jest-mock-extended";

import { AuthService, ILogoutDto, IRefreshTokenService } from "@/modules/auth";

describe("AuthService", () => {
  const refreshTokenService = mock<IRefreshTokenService>();

  const authService = AuthService.getInstance({
    refreshTokenService,
  });

  beforeEach(() => {
    mockReset(refreshTokenService);
  });

  describe("AuthService - logoutUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const validLogoutDto: ILogoutDto = {
      userId: "user-123",
      refreshToken: "refresh-token-123",
    };

    it("should successfully logout user and delete all refresh tokens", async () => {
      refreshTokenService.deleteAllTokens.mockResolvedValue(undefined);

      await authService.logoutUser(validLogoutDto);

      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        validLogoutDto.userId
      );
    });

    it("should handle errors from refresh token service", async () => {
      refreshTokenService.deleteAllTokens.mockRejectedValue(
        new Error("Database error")
      );

      await expect(authService.logoutUser(validLogoutDto)).rejects.toThrow(
        "Database error"
      );
    });
  });

  // describe("AuthService - exchangeOauthCodeForTokens", () => {
  //   const mockCode = "valid-code-123";

  //   const mockCodeData: OAuthCodePayloadDto = {
  //     userId: "user-123",
  //     accessToken: "access-token-123",
  //     refreshToken: "refresh-token-123",
  //   };

  //   it("should successfully exchange code for tokens and delete the code from cache", async () => {
  //     mockCacheService.get.mockReturnValue(mockCodeData);
  //     mockCacheService.del.mockReturnValue(1);

  //     const result = await authService.exchangeOauthCodeForTokens(mockCode);

  //     expect(result).toEqual({
  //       accessToken: mockCodeData.accessToken,
  //       refreshToken: mockCodeData.refreshToken,
  //     });

  //     expect(mockCacheService.get).toHaveBeenCalledWith(mockCode);

  //     expect(mockCacheService.del).toHaveBeenCalledWith(mockCode);
  //   });

  //   it("should throw BadRequestError if code is not found in cache", async () => {
  //     mockCacheService.get.mockReturnValue(null);

  //     await expect(
  //       authService.exchangeOauthCodeForTokens(mockCode)
  //     ).rejects.toThrow(new BadRequestError("Invalid or expired code"));

  //     expect(mockCacheService.del).not.toHaveBeenCalled();
  //   });

  //   it("should throw BadRequestError if code data is undefined", async () => {
  //     mockCacheService.get.mockReturnValue(undefined);

  //     await expect(
  //       authService.exchangeOauthCodeForTokens(mockCode)
  //     ).rejects.toThrow(new BadRequestError("Invalid or expired code"));

  //     expect(mockCacheService.del).not.toHaveBeenCalled();
  //   });

  //   it("should handle cache deletion failure", async () => {
  //     mockCacheService.get.mockReturnValue(mockCodeData);
  //     mockCacheService.del.mockImplementation(() => {
  //       throw new Error("Cache deletion failed");
  //     });

  //     await expect(
  //       authService.exchangeOauthCodeForTokens(mockCode)
  //     ).rejects.toThrow("Cache deletion failed");
  //   });

  //   it("should handle cache retrieval errors", async () => {
  //     mockCacheService.get.mockImplementation(() => {
  //       throw new Error("Cache retrieval failed");
  //     });

  //     await expect(
  //       authService.exchangeOauthCodeForTokens(mockCode)
  //     ).rejects.toThrow("Cache retrieval failed");
  //   });

  //   it("should handle empty code parameter", async () => {
  //     await expect(authService.exchangeOauthCodeForTokens("")).rejects.toThrow(
  //       new BadRequestError("Invalid or expired code")
  //     );

  //     expect(mockCacheService.get).toHaveBeenCalledWith("");
  //     expect(mockCacheService.del).not.toHaveBeenCalled();
  //   });

  //   it("should handle malformed code data in cache", async () => {
  //     mockCacheService.get.mockReturnValue({
  //       invalidData: "malformed",
  //     } as any);

  //     const result = await authService.exchangeOauthCodeForTokens(mockCode);

  //     expect(result).toEqual({
  //       accessToken: undefined,
  //       refreshToken: undefined,
  //     });
  //     expect(mockCacheService.del).toHaveBeenCalledWith(mockCode);
  //   });

  //   it("should handle zero deletion count", async () => {
  //     mockCacheService.get.mockReturnValue(mockCodeData);
  //     mockCacheService.del.mockReturnValue(0);

  //     const result = await authService.exchangeOauthCodeForTokens(mockCode);

  //     expect(result).toEqual({
  //       accessToken: mockCodeData.accessToken,
  //       refreshToken: mockCodeData.refreshToken,
  //     });
  //   });
  // });
});
