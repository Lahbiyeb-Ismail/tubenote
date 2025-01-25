import {
  BadRequestError,
  DatabaseError,
  ForbiddenError,
  UnauthorizedError,
} from "@/errors";

import { REFRESH_TOKEN_EXPIRES_IN } from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { stringToDate } from "@utils/convert-string-to-date";

import { RefreshTokenService } from "../refresh-token.service";

import type { IJwtService } from "@/modules/auth/core/services/jwt/jwt.types";
import type { LoginResponseDto } from "@/modules/auth/dtos/login-response.dto";
import type { RefreshDto } from "@/modules/auth/dtos/refresh.dto";
import type { JwtPayload } from "@/types";
import type { RefreshToken } from "../refresh-token.model";
import {
  type IRefreshTokenRepository,
  type IRefreshTokenService,
} from "../refresh-token.types";

jest.mock("@utils/convert-string-to-date");

describe("RefreshTokenService", () => {
  let refreshTokenService: IRefreshTokenService;

  const mockRefreshTokenRepository: jest.Mocked<IRefreshTokenRepository> = {
    saveToken: jest.fn(),
    findValidToken: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  };

  const mockJwtService: jest.Mocked<IJwtService> = {
    verify: jest.fn(),
    generateAuthTokens: jest.fn(),
    sign: jest.fn(),
  };

  const mockUserId = "test-user-id";
  const mockToken = "test-refresh-token";
  const mockTokenId = "token-id-001";
  const mockAccessToken = "test-access-token";
  const mockNewRefreshToken = "new-refresh-token";
  const expiresIn = stringToDate(REFRESH_TOKEN_EXPIRES_IN);

  const mockLoginResponse: LoginResponseDto = {
    accessToken: mockAccessToken,
    refreshToken: mockNewRefreshToken,
  };

  const mockRefreshToken: RefreshToken = {
    id: mockTokenId,
    userId: mockUserId,
    token: mockToken,
    createdAt: new Date(Date.now()),
    expiresAt: expiresIn,
  };

  beforeEach(() => {
    refreshTokenService = new RefreshTokenService(
      mockRefreshTokenRepository,
      mockJwtService
    );

    jest.clearAllMocks();
  });

  describe("RefreshTokenService - refreshToken", () => {
    const refreshDto: RefreshDto = { userId: mockUserId, token: mockToken };

    const decodedToken: JwtPayload = {
      userId: mockUserId,
      exp: 1123454,
      iat: 4445787,
    };

    it("should successfully return new auth tokens for a valid refresh token", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(
        mockRefreshToken
      );

      mockJwtService.generateAuthTokens.mockReturnValue(mockLoginResponse);

      mockRefreshTokenRepository.saveToken.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.refreshToken(refreshDto);

      expect(result).toEqual(mockLoginResponse);

      expect(mockJwtService.verify).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(mockToken);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(mockRefreshTokenRepository.saveToken).toHaveBeenCalledWith({
        userId: mockUserId,
        token: mockNewRefreshToken,
        expiresAt: expiresIn,
      });
    });

    it("should throw BadRequestError for an invalid refresh token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      mockJwtService.verify.mockRejectedValue(error);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(error);

      expect(mockJwtService.verify).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.findValidToken).not.toHaveBeenCalled();

      expect(mockRefreshTokenRepository.delete).not.toHaveBeenCalled();

      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError for mismatched user ID", async () => {
      mockJwtService.verify.mockResolvedValue({
        ...decodedToken,
        userId: "different-user-id",
      });

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should throw ForbiddenError and delete all tokens when refresh token reuse is detected", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(null);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should throw DatabaseError for database operation failure", async () => {
      const databaseError = new DatabaseError("Database error");

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(
        mockRefreshToken
      );

      mockRefreshTokenRepository.delete.mockRejectedValue(databaseError);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(databaseError);
    });
  });
});
