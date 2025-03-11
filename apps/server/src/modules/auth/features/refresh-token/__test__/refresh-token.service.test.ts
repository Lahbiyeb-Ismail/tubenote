import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";
import type { IAuthResponseDto, IRefreshDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import {
  BadRequestError,
  DatabaseError,
  ForbiddenError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { ICreateDto } from "@/modules/shared/dtos";
import type { ILoggerService, IPrismaService } from "@/modules/shared/services";
import type { JwtPayload } from "@/modules/shared/types";
import { stringToDate } from "@/modules/shared/utils";

import type { RefreshToken } from "../refresh-token.model";
import { RefreshTokenService } from "../refresh-token.service";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "../refresh-token.types";

jest.mock("@/modules/shared/utils", () => ({
  ...jest.requireActual("@/modules/shared/utils"),
  stringToDate: jest.fn(),
}));

describe("RefreshTokenService", () => {
  let refreshTokenService: IRefreshTokenService;

  const mockRefreshTokenRepository: jest.Mocked<IRefreshTokenRepository> = {
    create: jest.fn(),
    findValid: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
  };

  const mockPrismaService: Partial<IPrismaService> = {
    transaction: jest.fn(),
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
      mockPrismaService as IPrismaService,
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

    const mockTransaction = jest.fn();

    beforeEach(() => {
      // Set up transaction mock for proper testing
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTransaction);
        }
      );
    });

    it("should successfully return new auth tokens for a valid refresh token", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValid.mockResolvedValue(mockRefreshToken);

      (mockRefreshTokenRepository.delete as jest.Mock).mockResolvedValue(
        undefined
      );

      mockJwtService.generateAuthTokens.mockReturnValue(mockLoginResponse);

      mockRefreshTokenRepository.create.mockResolvedValue(mockRefreshToken);

      const result = await refreshTokenService.refreshToken(IrefreshDto);

      expect(result).toEqual(mockLoginResponse);

      expect(mockJwtService.verify).toHaveBeenCalled();

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(
        mockToken,
        mockTransaction
      );

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(mockRefreshTokenRepository.create).toHaveBeenCalledWith(
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

      mockJwtService.verify.mockRejectedValue(error);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(error);

      expect(mockJwtService.verify).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.findValid).not.toHaveBeenCalled();

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

      mockRefreshTokenRepository.findValid.mockResolvedValue(null);

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockRefreshTokenRepository.findValid).toHaveBeenCalledWith(
        mockToken,
        mockTransaction
      );

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId,
        mockTransaction
      );
    });

    it("should throw DatabaseError for database operation failure", async () => {
      const databaseError = new DatabaseError("Database error");

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValid.mockResolvedValue(mockRefreshToken);

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

    it("should handle create failure after token deletion", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockRefreshTokenRepository.findValid.mockResolvedValue(mockRefreshToken);

      mockRefreshTokenRepository.delete.mockResolvedValue();

      mockRefreshTokenRepository.create.mockRejectedValue(
        new DatabaseError("Save failed")
      );

      await expect(
        refreshTokenService.refreshToken(IrefreshDto)
      ).rejects.toThrow(DatabaseError);

      // Verify old token was deleted but new token wasn't saved
      expect(mockRefreshTokenRepository.delete).toHaveBeenCalled();
      expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
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

  describe("RefreshTokenService - create", () => {
    const createTokenDto: ICreateDto<RefreshToken> = {
      userId: mockUserId,
      data: {
        token: "new-token",
        expiresAt: new Date(),
      },
    };

    it("should create a new refresh token", async () => {
      mockRefreshTokenRepository.create.mockResolvedValue({
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

      mockRefreshTokenRepository.create.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.createToken(createTokenDto)
      ).rejects.toThrow(dbError);
    });
  });
});
