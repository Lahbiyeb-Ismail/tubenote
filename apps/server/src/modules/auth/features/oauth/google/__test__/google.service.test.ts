import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { User } from "@/modules/user";

import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
} from "@/modules/shared/services";

import type {
  OAuthCodePayloadDto,
  OAuthResponseDto,
} from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import type {
  IRefreshTokenService,
  RefreshToken,
} from "@/modules/auth/features";
import { GoogleAuthService } from "../google.service";

describe("GoogleAuthService", () => {
  let googleAuthService: GoogleAuthService;
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockRefreshTokenService: jest.Mocked<IRefreshTokenService>;
  let mockCryptoService: jest.Mocked<ICryptoService>;
  let mockCacheService: jest.Mocked<ICacheService>;
  let mockLoggerService: jest.Mocked<ILoggerService>;

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

  const mockOAuthCodePayload: OAuthCodePayloadDto = {
    userId: "user-id-123",
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  const mockRandomOAuthCode = "random-code";

  beforeEach(() => {
    mockJwtService = {
      generateAuthTokens: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    };
    mockRefreshTokenService = {
      createToken: jest.fn(),
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

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    };

    googleAuthService = new GoogleAuthService(
      mockJwtService,
      mockRefreshTokenService,
      mockCryptoService,
      mockCacheService,
      mockLoggerService
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

      mockRefreshTokenService.createToken.mockResolvedValue(mockRefreshToken);

      jest
        .spyOn(googleAuthService, "generateTemporaryCode")
        .mockResolvedValue(mockOAuthResponse.temporaryCode);

      const result = await googleAuthService.googleLogin(mockUser);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        data: {
          token: mockOAuthResponse.refreshToken,
          expiresAt: expect.any(Date), // Ensure the date is correctly parsed
        },
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
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED));
    });

    it("should propagate jwtService erros", async () => {
      mockJwtService.generateAuthTokens.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should propagate refreshTookenService errors", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };
      mockJwtService.generateAuthTokens.mockReturnValue(tokens);
      mockRefreshTokenService.createToken.mockRejectedValue(
        new Error("Database error")
      );

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Database error"
      );
    });

    it("should propagate generateTemporaryCode method errors", async () => {
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      mockJwtService.generateAuthTokens.mockReturnValue(tokens);

      mockRefreshTokenService.createToken.mockResolvedValue(mockRefreshToken);

      jest
        .spyOn(googleAuthService, "generateTemporaryCode")
        .mockRejectedValue(new Error("Failed to generate temporary code"));

      await expect(googleAuthService.googleLogin(mockUser)).rejects.toThrow(
        "Failed to generate temporary code"
      );
    });
  });

  describe("GoogleAuthService - generateTemporaryCode", () => {
    it("should generate a temporary code and store payload in cache", async () => {
      mockCryptoService.generateRandomSecureToken.mockReturnValue(
        mockRandomOAuthCode
      );
      mockCacheService.set.mockReturnValue(true);

      const code =
        await googleAuthService.generateTemporaryCode(mockOAuthCodePayload);

      expect(typeof code).toBe("string");

      expect(code).toBe(mockRandomOAuthCode);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        code,
        mockOAuthCodePayload
      );
    });

    it("should generate unique codes for subsequent calls", async () => {
      const codes = new Set();
      const mockCodes = ["code1", "code2", "code3"];

      mockCryptoService.generateRandomSecureToken
        .mockImplementationOnce(() => mockCodes[0])
        .mockImplementationOnce(() => mockCodes[1])
        .mockImplementationOnce(() => mockCodes[2]);

      for (const _code of mockCodes) {
        const generatedCode =
          await googleAuthService.generateTemporaryCode(mockOAuthCodePayload);
        codes.add(generatedCode);
      }

      expect(codes.size).toBe(mockCodes.length);
    });

    it("should propagate cacheService errors", async () => {
      mockCacheService.set.mockImplementation(() => {
        throw new Error("Cache service error");
      });

      await expect(
        googleAuthService.generateTemporaryCode(mockOAuthCodePayload)
      ).rejects.toThrow("Cache service error");
    });

    it("should propagate crypto service errors", async () => {
      mockCryptoService.generateRandomSecureToken.mockImplementation(() => {
        throw new Error("Crypto service failure");
      });

      await expect(
        googleAuthService.generateTemporaryCode(mockOAuthCodePayload)
      ).rejects.toThrow("Crypto service failure");
    });
  });
});
