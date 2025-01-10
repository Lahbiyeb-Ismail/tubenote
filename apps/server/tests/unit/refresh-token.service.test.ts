import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { NotFoundError } from "../../src/errors";

import { IRefreshTokenDatabase } from "../../src/modules/refreshToken/refresh-token.db";
import {
  IRefreshTokenService,
  RefreshTokenService,
} from "../../src/modules/refreshToken/refresh-token.service";

import type { RefreshTokenDto } from "../../src/modules/refreshToken/dtos/refresh-token.dto";

describe("RefreshTokenService methods test", () => {
  let refreshTokenService: IRefreshTokenService;
  let mockRefreshTokenDB: IRefreshTokenDatabase;

  beforeEach(() => {
    mockRefreshTokenDB = {
      create: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };

    refreshTokenService = new RefreshTokenService(mockRefreshTokenDB);
  });

  const mockUserId = "user_id_001";
  const mockToken = "refresh_token_test_001";

  const mockRefreshTokenDto: RefreshTokenDto = {
    id: "token123",
    token: mockToken,
    userId: mockUserId,
    createdAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("RefreshTokenService - createToken", () => {
    it("should create a new refresh token", async () => {
      (mockRefreshTokenDB.create as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      const result = await refreshTokenService.createToken(
        mockUserId,
        mockToken
      );

      expect(result).toEqual(mockRefreshTokenDto);

      expect(mockRefreshTokenDB.create).toHaveBeenCalledWith(
        mockToken,
        mockUserId
      );
    });
  });

  describe("RefreshTokenService - findToken", () => {
    it("Should find a refresh token and return it", async () => {
      (mockRefreshTokenDB.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toEqual(mockRefreshTokenDto);

      expect(mockRefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });

    it("Should return null if the refresh token is not found", async () => {
      (mockRefreshTokenDB.find as jest.Mock).mockResolvedValue(null);

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toBeNull();

      expect(mockRefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("RefreshTokenService - deleteToken", () => {
    it("Should delete a refresh token", async () => {
      (mockRefreshTokenDB.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      await refreshTokenService.deleteToken(mockToken);

      expect(mockRefreshTokenDB.delete).toHaveBeenCalledWith(mockToken);
    });

    it("Should throw a NotFoundError if the refresh token is not found", async () => {
      (mockRefreshTokenDB.find as jest.Mock).mockResolvedValue(null);

      await expect(refreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockRefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("RefreshTokenService - deleteAllTokens", () => {
    it("Should delete all refresh tokens for a user", async () => {
      await refreshTokenService.deleteAllTokens(mockUserId);

      expect(mockRefreshTokenDB.deleteAll).toHaveBeenCalledWith(mockUserId);
    });
  });
});
