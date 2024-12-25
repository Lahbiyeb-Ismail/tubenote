import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { NotFoundError } from "../../../errors";
import type { RefreshTokenEntry } from "../refreshToken.type";
import RefreshTokenDB from "../refreshTokenDB";
import RefreshTokenService from "../refreshTokenService";

jest.mock("../refreshTokenDB");

describe("RefreshTokenService methods test", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  const mockUserId = "user123";
  const mockToken = "mockRefreshTokenValue";

  const mockRefreshTokenEntry: RefreshTokenEntry = {
    id: "token123",
    token: mockToken,
    userId: mockUserId,
    createdAt: new Date(),
  };

  describe("createToken method tests", () => {
    it("should create a new refresh token", async () => {
      (RefreshTokenDB.create as jest.Mock).mockResolvedValue(
        mockRefreshTokenEntry
      );

      const result = await RefreshTokenService.createToken(
        mockUserId,
        mockToken
      );

      expect(result).toEqual(mockRefreshTokenEntry);

      expect(RefreshTokenDB.create).toHaveBeenCalledWith(mockToken, mockUserId);
    });
  });

  describe("findToken method tests", () => {
    it("Should find a refresh token and return it", async () => {
      (RefreshTokenDB.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenEntry
      );

      const result = await RefreshTokenService.findToken(mockToken);

      expect(result).toEqual(mockRefreshTokenEntry);

      expect(RefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });

    it("Should return null if the refresh token is not found", async () => {
      (RefreshTokenDB.find as jest.Mock).mockResolvedValue(null);

      const result = await RefreshTokenService.findToken(mockToken);

      expect(result).toBeNull();

      expect(RefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("deleteToken method tests", () => {
    it("Should delete a refresh token", async () => {
      (RefreshTokenDB.find as jest.Mock).mockResolvedValue(
        mockRefreshTokenEntry
      );

      await RefreshTokenService.deleteToken(mockToken);

      expect(RefreshTokenDB.delete).toHaveBeenCalledWith(mockToken);
    });

    it("Should throw a NotFoundError if the refresh token is not found", async () => {
      (RefreshTokenDB.find as jest.Mock).mockResolvedValue(null);

      await expect(RefreshTokenService.deleteToken(mockToken)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(RefreshTokenDB.find).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("deleteAllTokens method tests", () => {
    it("Should delete all refresh tokens for a user", async () => {
      await RefreshTokenService.deleteAllTokens(mockUserId);

      expect(RefreshTokenDB.deleteAll).toHaveBeenCalledWith(mockUserId);
    });
  });
});
