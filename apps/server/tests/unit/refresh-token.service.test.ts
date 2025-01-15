import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { NotFoundError } from "../../src/errors";

import { RefreshTokenService } from "../../src/modules/refreshToken/refresh-token.service";

import type { RefreshToken } from "../../src/modules/refreshToken/refresh-token.model";

import type { CreateTokenDto } from "../../src/modules/refreshToken/dtos/create-token.dto";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "../../src/modules/refreshToken/refresh-token.types";

describe("RefreshTokenService methods test", () => {
  let refreshTokenService: IRefreshTokenService;
  let mockRefreshTokenRepository: IRefreshTokenRepository;

  beforeEach(() => {
    mockRefreshTokenRepository = {
      create: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };

    refreshTokenService = new RefreshTokenService(mockRefreshTokenRepository);
  });

  const mockUserId = "user_id_001";
  const mockToken = "refresh_token_test_001";

  const mockRefreshTokenDto: RefreshToken = {
    id: "token123",
    token: mockToken,
    userId: mockUserId,
    createdAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("RefreshTokenService - createToken", () => {
    const createTokenDto: CreateTokenDto = {
      userId: mockUserId,
      token: mockToken,
    };

    it("should create a new refresh token", async () => {
      (mockRefreshTokenRepository.create as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      const result = await refreshTokenService.createToken(createTokenDto);

      expect(result).toEqual(mockRefreshTokenDto);

      expect(mockRefreshTokenRepository.create).toHaveBeenCalledWith(
        createTokenDto
      );
    });
  });

  describe("RefreshTokenService - findToken", () => {
    it("Should find a refresh token and return it", async () => {
      (mockRefreshTokenRepository.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toEqual(mockRefreshTokenDto);

      expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(mockToken);
    });

    it("Should return null if the refresh token is not found", async () => {
      (mockRefreshTokenRepository.find as jest.Mock).mockResolvedValue(null);

      const result = await refreshTokenService.findToken(mockToken);

      expect(result).toBeNull();

      expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("RefreshTokenService - deleteToken", () => {
    it("Should delete a refresh token", async () => {
      (mockRefreshTokenRepository.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenDto
      );

      await refreshTokenService.deleteToken(mockToken);

      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(mockToken);
    });

    it("Should throw a NotFoundError if the refresh token is not found", async () => {
      (mockRefreshTokenRepository.find as jest.Mock).mockResolvedValue(null);

      await expect(refreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("RefreshTokenService - deleteAllTokens", () => {
    it("Should delete all refresh tokens for a user", async () => {
      await refreshTokenService.deleteAllTokens(mockUserId);

      expect(mockRefreshTokenRepository.deleteAll).toHaveBeenCalledWith(
        mockUserId
      );
    });
  });
});
