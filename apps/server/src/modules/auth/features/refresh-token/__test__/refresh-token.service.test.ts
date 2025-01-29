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

import type { AuthResponseDto, RefreshDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils/services/jwt/jwt.types";
import type { JwtPayload } from "@/types";
import type { SaveTokenDto } from "../dtos/save-token.dto";
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

  const mockLoginResponse: AuthResponseDto = {
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

    it("should throw error for expired refresh token", async () => {
      const expiredError = new UnauthorizedError(ERROR_MESSAGES.EXPIRED_TOKEN);

      mockJwtService.verify.mockRejectedValue(expiredError);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(expiredError);
    });

    it("should handle invalid token payload structure", async () => {
      const invalidDecodedToken = { foo: "bar" } as unknown as JwtPayload;
      mockJwtService.verify.mockResolvedValue(invalidDecodedToken);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(UnauthorizedError);

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalled();
    });

    it("should handle saveToken failure after token deletion", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(
        mockRefreshToken
      );

      mockRefreshTokenRepository.delete.mockResolvedValue();

      mockRefreshTokenRepository.saveToken.mockRejectedValue(
        new DatabaseError("Save failed")
      );

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(DatabaseError);

      // Verify old token was deleted but new token wasn't saved
      expect(mockRefreshTokenRepository.delete).toHaveBeenCalled();
      expect(mockRefreshTokenRepository.saveToken).toHaveBeenCalled();
    });
  });

  describe("RefreshTokenService - deleteAllTokens", () => {
    it("should delete all tokens for a user", async () => {
      await refreshTokenService.deleteAllTokens(mockUserId);

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should handle deleteAllTokens repository failure", async () => {
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE);

      mockRefreshTokenRepository.deleteAll.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.deleteAllTokens(mockUserId)
      ).rejects.toThrow(dbError);
    });
  });

  describe("RefreshTokenService - saveToken", () => {
    const saveDto: SaveTokenDto = {
      userId: mockUserId,
      token: "new-token",
      expiresAt: new Date(),
    };

    it("should save a valid token", async () => {
      mockRefreshTokenRepository.saveToken.mockResolvedValue({
        ...saveDto,
        id: "new-id",
        createdAt: new Date(),
      });

      const result = await refreshTokenService.saveToken(saveDto);
      expect(result).toMatchObject(saveDto);
    });

    it("should propagate refreshTokenRepository errors", async () => {
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILD_TO_CREATE);

      mockRefreshTokenRepository.saveToken.mockRejectedValue(dbError);

      await expect(refreshTokenService.saveToken(saveDto)).rejects.toThrow(
        dbError
      );
    });
  });
});
