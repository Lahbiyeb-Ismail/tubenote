import { UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { GoogleAuthService } from "../google.service";

import type { ICacheService } from "@/modules/utils/cache/cache.types";
import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";

import type { OauthLoginResponseDto } from "@/modules/auth/dtos/oauth-login-response.dto";
import type { RefreshToken } from "@/modules/auth/features/refresh-token/refresh-token.model";
import type { User } from "@modules/user/user.model";

describe("GoogleAuthService", () => {
  let googleAuthService: GoogleAuthService;
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockRefreshTokenService: jest.Mocked<IRefreshTokenService>;
  let mockCacheService: jest.Mocked<ICacheService>;

  const mockUser: User = {
    id: "user-id-123",
    username: "test user",
    email: "user@test.com",
    password: "password123!",
    googleId: "google-id-123",
    profilePicture: "google-profile-picture",
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRefreshToken: RefreshToken = {
    id: "token-id-123",
    userId: "user-id-123",
    token: "refresh-token",
    createdAt: new Date(),
    expiresAt: new Date(),
  };

  beforeEach(() => {
    mockJwtService = {
      generateAuthTokens: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    };
    mockRefreshTokenService = {
      saveToken: jest.fn(),
      refreshToken: jest.fn(),
      deleteAllTokens: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      flush: jest.fn(),
      getStats: jest.fn(),
    };

    googleAuthService = new GoogleAuthService(
      mockJwtService,
      mockRefreshTokenService,
      mockCacheService
    );
  });

  describe("googleLogin", () => {
    it("should generate tokens and save refresh token if user is valid", async () => {
      const tokens: OauthLoginResponseDto = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        temporaryCode: "temporary-oauth-code",
      };

      mockJwtService.generateAuthTokens.mockReturnValue(tokens);
      mockRefreshTokenService.saveToken.mockResolvedValue(mockRefreshToken);

      const result = await googleAuthService.googleLogin(mockUser);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.saveToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: tokens.refreshToken,
        expiresAt: expect.any(Date), // Ensure the date is correctly parsed
      });

      expect(result.accessToken).toEqual(tokens.accessToken);
    });

    it("should throw UnauthorizedError if user email is not verified", async () => {
      const unverifiedUser = { ...mockUser, isEmailVerified: false };

      await expect(
        googleAuthService.googleLogin(unverifiedUser)
      ).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );
    });

    it("should throw an error if token generation fails", async () => {
      mockJwtService.generateAuthTokens.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should throw an error if saving refresh token fails", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };
      mockJwtService.generateAuthTokens.mockReturnValue(tokens);
      mockRefreshTokenService.saveToken.mockRejectedValue(
        new Error("Database error")
      );

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
