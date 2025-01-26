import { UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { GoogleAuthService } from "../google.service";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";

import type { LoginResponseDto } from "@/modules/auth/dtos/login-response.dto";
import type { RefreshToken } from "@/modules/auth/features/refresh-token/refresh-token.model";
import type { User } from "@modules/user/user.model";

describe("GoogleAuthService", () => {
  let googleAuthService: GoogleAuthService;
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockRefreshTokenService: jest.Mocked<IRefreshTokenService>;

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
    googleAuthService = new GoogleAuthService(
      mockJwtService,
      mockRefreshTokenService
    );
  });

  describe("googleLogin", () => {
    it("should generate tokens and save refresh token if user is valid", async () => {
      const tokens: LoginResponseDto = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
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
      expect(result).toEqual(tokens);
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
