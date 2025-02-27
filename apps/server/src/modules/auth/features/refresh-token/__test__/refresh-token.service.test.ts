import { stringToDate } from "@utils/convert-string-to-date";

import {
  BadRequestError,
  DatabaseError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from "@modules/shared";

import { REFRESH_TOKEN_EXPIRES_IN } from "@modules/auth";

import type {
  IAuthResponseDto,
  IJwtService,
  IRefreshDto,
} from "@/modules/auth";
import type { ICreateDto, ILoggerService, JwtPayload } from "@/modules/shared";

import type { RefreshToken } from "../refresh-token.model";
import { RefreshTokenService } from "../refresh-token.service";
import {
  type IRefreshTokenRepository,
  type IRefreshTokenService,
} from "../refresh-token.types";

jest.mock("@utils/convert-string-to-date");

describe("RefreshTokenService", () => {
  let refreshTokenService: IRefreshTokenService;

  const mockRefreshTokenRepository: jest.Mocked<IRefreshTokenRepository> = {
    createToken: jest.fn(),
    findValidToken: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  };

  const mockJwtService: jest.Mocked<IJwtService> = {
    verify: jest.fn(),
    generateAuthTokens: jest.fn(),
    sign: jest.fn(),
  };

  const mockLoggerService: jest.Mocked<ILoggerService> = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  };

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
    refreshTokenService = new RefreshTokenService(
      mockRefreshTokenRepository,
      mockJwtService,
      mockLoggerService
    );

    jest.clearAllMocks();
  });

  describe("RefreshTokenService - refreshToken", () => {
    const IrefreshDto: IRefreshDto = { userId: mockUserId, token: mockToken };

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

      mockRefreshTokenRepository.createToken.mockResolvedValue(
        mockRefreshToken
      );

      const result = await refreshTokenService.refreshToken(IrefreshDto);

      expect(result).toEqual(mockLoginResponse);

      expect(mockJwtService.verify).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(mockToken);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(mockRefreshTokenRepository.createToken).toHaveBeenCalledWith({
        userId: mockUserId,
        data: {
          token: mockNewRefreshToken,
          expiresAt: expiresIn,
        },
      });
    });

    it("should throw BadRequestError for an invalid refresh token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      mockJwtService.verify.mockRejectedValue(error);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
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
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should throw ForbiddenError and delete all tokens when refresh token reuse is detected", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(null);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
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
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(databaseError);
    });

    it("should throw error for expired refresh token", async () => {
      const expiredError = new UnauthorizedError(ERROR_MESSAGES.EXPIRED_TOKEN);

      mockJwtService.verify.mockRejectedValue(expiredError);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(expiredError);
    });

    it("should handle invalid token payload structure", async () => {
      const invalidDecodedToken = { foo: "bar" } as unknown as JwtPayload;
      mockJwtService.verify.mockResolvedValue(invalidDecodedToken);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(UnauthorizedError);

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalled();
    });

    it("should handle createToken failure after token deletion", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValidToken.mockResolvedValue(
        mockRefreshToken
      );

      mockRefreshTokenRepository.delete.mockResolvedValue();

      mockRefreshTokenRepository.createToken.mockRejectedValue(
        new DatabaseError("Save failed")
      );

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(DatabaseError);

      // Verify old token was deleted but new token wasn't saved
      expect(mockRefreshTokenRepository.delete).toHaveBeenCalled();
      expect(mockRefreshTokenRepository.createToken).toHaveBeenCalled();
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
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILED_TO_DELETE);

      mockRefreshTokenRepository.deleteAll.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.deleteAllTokens(mockUserId)
      ).rejects.toThrow(dbError);
    });
  });

  describe("RefreshTokenService - createToken", () => {
    const createTokenDto: ICreateDto<RefreshToken> = {
      userId: mockUserId,
      data: {
        token: "new-token",
        expiresAt: new Date(),
      },
    };

    it("should create a new refresh token", async () => {
      mockRefreshTokenRepository.createToken.mockResolvedValue({
        ...createTokenDto.data,
        id: "new-id",
        userId: mockUserId,
        createdAt: new Date(),
      });

      const result = await refreshTokenService.createToken(createTokenDto);
      expect(result).toMatchObject({
        userId: createTokenDto.userId,
        ...createTokenDto.data,
        id: expect.any(String),
        createdAt: expect.any(Date),
      });
    });

    it("should propagate refreshTokenRepository errors", async () => {
      const dbError = new DatabaseError(ERROR_MESSAGES.FAILED_TO_CREATE);

      mockRefreshTokenRepository.createToken.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.createToken(createTokenDto)
      ).rejects.toThrow(dbError);
    });
  });
});
