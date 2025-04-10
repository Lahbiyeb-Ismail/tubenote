import { mock, mockReset } from "jest-mock-extended";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";
import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import {
  BadRequestError,
  DatabaseError,
  ForbiddenError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ILoggerService, IPrismaService } from "@/modules/shared/services";
import type { JwtPayload } from "@/modules/shared/types";

import { stringToDate } from "@/modules/shared/utils";

import type { ICreateRefreshTokenDto } from "../dtos";
import type { RefreshToken } from "../refresh-token.model";
import { RefreshTokenService } from "../refresh-token.service";
import type { IRefreshTokenRepository } from "../refresh-token.types";

jest.mock("@/modules/shared/utils", () => ({
  ...jest.requireActual("@/modules/shared/utils"),
  stringToDate: jest.fn(),
}));

describe("RefreshTokenService", () => {
  const refreshTokenRepository = mock<IRefreshTokenRepository>();

  const prismaService = mock<IPrismaService>();

  const jwtService = mock<IJwtService>();

  const loggerService = mock<ILoggerService>();

  const refreshTokenService = RefreshTokenService.getInstance({
    refreshTokenRepository,
    prismaService,
    jwtService,
    loggerService,
  });

  const mockUserId = "test-user-id";
  const mockToken = "test-refresh-token";
  const mockTokenId = "token-id-001";
  const mockAccessToken = "test-access-token";
  const mockNewRefreshToken = "new-refresh-token";
  const expiresIn = stringToDate(REFRESH_TOKEN_EXPIRES_IN);

  const mockLoginResponse: IAuthResponseDto = {
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
    mockReset(refreshTokenRepository);
    mockReset(prismaService);
    mockReset(jwtService);
    mockReset(loggerService);

    jest.clearAllMocks();
  });

  describe("RefreshTokenService - refreshToken", () => {
    const decodedToken: JwtPayload = {
      userId: mockUserId,
      exp: 1123454,
      iat: 4445787,
    };

    const mockTransaction = jest.fn();

    beforeEach(() => {
      // Set up transaction mock for proper testing
      (prismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTransaction);
        }
      );
    });

    it("should successfully return new auth tokens for a valid refresh token", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      refreshTokenRepository.findValid.mockResolvedValue(mockRefreshToken);

      (refreshTokenRepository.delete as jest.Mock).mockResolvedValue(undefined);

      jwtService.generateAuthTokens.mockReturnValue(mockLoginResponse);

      refreshTokenRepository.create.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.refreshToken(
        mockUserId,
        mockToken
      );

      expect(result).toEqual(mockLoginResponse);

      expect(jwtService.verify).toHaveBeenCalled();

      expect(prismaService.transaction).toHaveBeenCalled();

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith(
        mockToken,
        mockTransaction
      );

      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(mockUserId);

      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        {
          userId: mockUserId,
          data: {
            token: mockNewRefreshToken,
            expiresAt: expiresIn,
          },
        },
        mockTransaction
      );
    });

    it("should throw BadRequestError for an invalid refresh token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      jwtService.verify.mockRejectedValue(error);

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(error);

      expect(jwtService.verify).toHaveBeenCalled();

      expect(refreshTokenRepository.findValid).not.toHaveBeenCalled();

      expect(refreshTokenRepository.delete).not.toHaveBeenCalled();

      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError for mismatched user ID", async () => {
      jwtService.verify.mockResolvedValue({
        ...decodedToken,
        userId: "different-user-id",
      });

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(refreshTokenRepository.deleteAll).toHaveBeenCalledWith(mockUserId);
    });

    it("should throw ForbiddenError and delete all tokens when refresh token reuse is detected", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      refreshTokenRepository.findValid.mockResolvedValue(null);

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(prismaService.transaction).toHaveBeenCalled();

      expect(refreshTokenRepository.findValid).toHaveBeenCalledWith(
        mockToken,
        mockTransaction
      );

      expect(refreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId,
        mockTransaction
      );
    });

    it("should throw DatabaseError for database operation failure", async () => {
      const databaseError = new DatabaseError("Database error");

      jwtService.verify.mockResolvedValue(decodedToken);

      refreshTokenRepository.findValid.mockResolvedValue(mockRefreshToken);

      refreshTokenRepository.delete.mockRejectedValue(databaseError);

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(databaseError);
    });

    it("should throw error for expired refresh token", async () => {
      const expiredError = new UnauthorizedError(ERROR_MESSAGES.EXPIRED_TOKEN);

      jwtService.verify.mockRejectedValue(expiredError);

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(expiredError);
    });

    it("should handle invalid token payload structure", async () => {
      const invalidDecodedToken = { foo: "bar" } as unknown as JwtPayload;
      jwtService.verify.mockResolvedValue(invalidDecodedToken);

      await expect(
        refreshTokenService.refreshToken(mockUserId, mockToken)
      ).rejects.toThrow(UnauthorizedError);

      expect(refreshTokenRepository.deleteAll).toHaveBeenCalled();
    });
  });

  describe("RefreshTokenService - deleteAllTokens", () => {
    it("should delete all tokens for a user", async () => {
      await refreshTokenService.deleteAllTokens(mockUserId);

      expect(refreshTokenRepository.deleteAll).toHaveBeenCalledWith(mockUserId);
    });

    it("should handle deleteAllTokens repository failure", async () => {
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILED_TO_DELETE);

      refreshTokenRepository.deleteAll.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.deleteAllTokens(mockUserId)
      ).rejects.toThrow(dbError);
    });
  });

  describe("RefreshTokenService - create", () => {
    const createTokenDto: ICreateRefreshTokenDto = {
      token: "new-token",
      expiresAt: new Date(),
    };

    it("should create a new refresh token", async () => {
      refreshTokenRepository.create.mockResolvedValue({
        ...createTokenDto,
        id: "new-id",
        userId: mockUserId,
        createdAt: new Date(),
      });

      const result = await refreshTokenService.createToken(
        mockUserId,
        createTokenDto
      );
      expect(result).toMatchObject({
        ...createTokenDto,
        userId: mockUserId,
        id: expect.any(String),
        createdAt: expect.any(Date),
      });
    });

    it("should propagate refreshTokenRepository errors", async () => {
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILED_TO_CREATE);

      refreshTokenRepository.create.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.createToken(mockUserId, createTokenDto)
      ).rejects.toThrow(dbError);
    });
  });
});
