import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/errors";

import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { RefreshTokenService } from "../refresh-token.service";

import type { IJwtService } from "@/modules/auth/core/services/jwt/jwt.types";
import type { RefreshDto } from "@/modules/auth/dtos/refresh.dto";
import type { JwtPayload } from "@/types";
import type { CreateTokenDto } from "../dtos/create-token.dto";
import type { RefreshToken } from "../refresh-token.model";
import {
  type IRefreshTokenRepository,
  type IRefreshTokenService,
} from "../refresh-token.types";

describe("RefreshTokenService", () => {
  let refreshTokenService: IRefreshTokenService;

  const mockRefreshTokenRepository: jest.Mocked<IRefreshTokenRepository> = {
    create: jest.fn(),
    find: jest.fn(),
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

  const mockRefreshToken: RefreshToken = {
    id: mockTokenId,
    userId: mockUserId,
    token: mockToken,
    createdAt: new Date(),
  };

  beforeEach(() => {
    refreshTokenService = new RefreshTokenService(
      mockRefreshTokenRepository,
      mockJwtService
    );

    jest.clearAllMocks();
  });

  describe("RefreshTokenService - createToken", () => {
    const createTokenDto: CreateTokenDto = {
      userId: mockUserId,
      token: mockToken,
    };

    it("should create a refresh token", async () => {
      mockRefreshTokenRepository.create.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.createToken(createTokenDto);

      expect(result).toEqual(mockRefreshToken);

      expect(mockRefreshTokenRepository.create).toHaveBeenCalledWith(
        createTokenDto
      );
    });

    it("should handle unexpected errors from refresh Token repository create method", async () => {
      const error = new Error("creation of token failed");

      mockRefreshTokenRepository.create.mockRejectedValue(error);

      await expect(
        refreshTokenService.createToken(createTokenDto)
      ).rejects.toThrow(error);
    });
  });

  describe("RefreshTokenService - findToken", () => {
    it("should find a refreshToken by token value", async () => {
      mockRefreshTokenRepository.find.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toEqual(mockRefreshToken);
      expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(mockToken);
    });

    it("should return null when token is not found", async () => {
      mockRefreshTokenRepository.find.mockResolvedValue(null);

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toBeNull();
      expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(mockToken);
    });

    it("should handle unexpected errors from refresh Token repository find method", async () => {
      const error = new Error("finding token failed");

      mockRefreshTokenRepository.find.mockRejectedValue(error);

      await expect(refreshTokenService.findToken(mockToken)).rejects.toThrow(
        error
      );
    });
  });

  describe("RefreshTokenService - deleteToken", () => {
    it("should delete a token if it exists", async () => {
      mockRefreshTokenRepository.find.mockResolvedValue(mockRefreshToken);

      await refreshTokenService.deleteToken(mockToken);

      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(mockToken);
    });

    it("should throw NotFoundError if token does not exist", async () => {
      mockRefreshTokenRepository.find.mockResolvedValue(null);

      await expect(refreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
    });

    it("should handle unexpected errors from refresh Token repository find method", async () => {
      const error = new Error("finding token failed");

      mockRefreshTokenRepository.find.mockRejectedValue(error);

      await expect(refreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        error
      );
    });

    it("should handle unexpected errors from refresh Token repository delete method", async () => {
      const error = new Error("deleting token failed");

      mockRefreshTokenRepository.find.mockResolvedValue(mockRefreshToken);

      mockRefreshTokenRepository.delete.mockRejectedValue(error);

      await expect(refreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        error
      );
    });
  });

  describe("RefreshTokenService - deleteAllTokens", () => {
    it("should delete all tokens for a user", async () => {
      await refreshTokenService.deleteAllTokens(mockUserId);

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should handle unexpected errors from refresh Token repository deleteAll method", async () => {
      const error = new Error("deleting all tokens failed");

      mockRefreshTokenRepository.deleteAll.mockRejectedValue(error);

      await expect(
        refreshTokenService.deleteAllTokens(mockUserId)
      ).rejects.toThrow(error);
    });
  });

  describe("RefreshTokenService - refreshToken", () => {
    const refreshDto: RefreshDto = { userId: mockUserId, token: mockToken };

    const mockPayload: JwtPayload = {
      userId: mockUserId,
      exp: 1123454,
      iat: 4445787,
    };

    it("should successfully refresh tokens", async () => {
      mockJwtService.verify.mockResolvedValue(mockPayload);

      jest
        .spyOn(refreshTokenService, "findToken")
        .mockResolvedValue(mockRefreshToken);

      jest
        .spyOn(refreshTokenService, "deleteToken")
        .mockResolvedValue(undefined);

      mockJwtService.generateAuthTokens.mockReturnValue({
        accessToken: mockAccessToken,
        refreshToken: mockNewRefreshToken,
      });

      jest
        .spyOn(refreshTokenService, "createToken")
        .mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.refreshToken(refreshDto);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockNewRefreshToken,
      });

      expect(refreshTokenService.findToken).toHaveBeenCalledWith(mockToken);

      expect(refreshTokenService.deleteToken).toHaveBeenCalledWith(mockToken);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(refreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUserId,
        token: mockNewRefreshToken,
      });
    });

    it("should throw ForbiddenError when JWT verification fails adn delete all user's tokens", async () => {
      mockJwtService.verify.mockResolvedValue(null);

      jest
        .spyOn(refreshTokenService, "deleteAllTokens")
        .mockResolvedValue(undefined);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should throw UnauthorizedError when userId does not match payload", async () => {
      mockJwtService.verify.mockResolvedValue({
        ...mockPayload,
        userId: "different-user-id",
      });

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    });

    it("should throw ForbiddenError and delete all tokens when refresh token reuse is detected", async () => {
      mockJwtService.verify.mockResolvedValue(mockPayload);

      jest.spyOn(refreshTokenService, "findToken").mockResolvedValue(null);

      jest
        .spyOn(refreshTokenService, "deleteAllTokens")
        .mockResolvedValue(undefined);

      await expect(
        refreshTokenService.refreshToken(refreshDto)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(refreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        mockUserId
      );
    });
  });
});
