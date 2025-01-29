import { UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { GoogleAuthService } from "../google.service";

import type { ICacheService } from "@/modules/utils/cache/cache.types";
import type { ICryptoService } from "@/modules/utils/crypto";
import type { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";
import type { IJwtService } from "@modules/auth/utils/services/jwt/jwt.types";

import type {
  OAuthCodePayloadDto,
  OAuthResponseDto,
} from "@/modules/auth/dtos";
import type { RefreshToken } from "@/modules/auth/features/refresh-token/refresh-token.model";
import type { User } from "@modules/user/user.model";

describe("GoogleAuthService", () => {
  let googleAuthService: GoogleAuthService;
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockRefreshTokenService: jest.Mocked<IRefreshTokenService>;
  let mockCryptoService: jest.Mocked<ICryptoService>;
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

    mockCryptoService = {
      comparePasswords: jest.fn(),
      hashPassword: jest.fn(),
      generateRandomSecureToken: jest.fn(),
      hashToken: jest.fn(),
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
      mockCryptoService,
      mockCacheService
    );
  });

  describe("GoogleAuthService - googleLogin", () => {
    it("should generate tokens and save refresh token if user is valid", async () => {
      const mockOAuthResponse: OAuthResponseDto = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        temporaryCode: "temporary-oauth-code",
      };

      mockJwtService.generateAuthTokens.mockReturnValue(mockOAuthResponse);

      mockRefreshTokenService.saveToken.mockResolvedValue(mockRefreshToken);

      jest
        .spyOn(googleAuthService, "generateTemporaryCode")
        .mockResolvedValue(mockOAuthResponse.temporaryCode);

      const result = await googleAuthService.googleLogin(mockUser);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.saveToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: mockOAuthResponse.refreshToken,
        expiresAt: expect.any(Date), // Ensure the date is correctly parsed
      });

      expect(googleAuthService.generateTemporaryCode).toHaveBeenCalledWith({
        userId: mockUser.id,
        accessToken: mockOAuthResponse.accessToken,
        refreshToken: mockOAuthResponse.refreshToken,
      });

      expect(result).toEqual(mockOAuthResponse);
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

    it("should handle temporary code generation failure", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      mockJwtService.generateAuthTokens.mockReturnValue(tokens);

      mockRefreshTokenService.saveToken.mockResolvedValue(mockRefreshToken);

      jest
        .spyOn(googleAuthService, "generateTemporaryCode")
        .mockRejectedValue(new Error("Failed to generate temporary code"));

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Failed to generate temporary code"
      );
    });
  });

  describe("GoogleAuthService - generateTemporaryCode", () => {
    const mockOAuthCodePayload: OAuthCodePayloadDto = {
      userId: "user-id-123",
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    it("should generate a temporary code and store payload in cache", async () => {
      const mockRandomCode = "random-code";

      mockCryptoService.generateRandomSecureToken.mockReturnValue(
        mockRandomCode
      );
      mockCacheService.set.mockReturnValue(true);

      const code =
        await googleAuthService.generateTemporaryCode(mockOAuthCodePayload);

      expect(typeof code).toBe("string");

      expect(code).toBe(mockRandomCode);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        code,
        mockOAuthCodePayload
      );
    });

    it("should handle cache service errors", async () => {
      mockCacheService.set.mockImplementation(() => {
        throw new Error("Cache service error");
      });

      await expect(
        googleAuthService.generateTemporaryCode(mockOAuthCodePayload)
      ).rejects.toThrow("Cache service error");
    });
  });
});
