import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { DatabaseError } from "@/errors";
import { PrismaClient } from "@prisma/client";
import type { CreateTokenDto } from "../dtos/create-token.dto";
import type { RefreshToken } from "../refresh-token.model";
import { RefreshTokenRepository } from "../refresh-token.repository";

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  })),
}));

describe("RefreshTokenRepository", () => {
  let repository: RefreshTokenRepository;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    repository = new RefreshTokenRepository(mockPrismaClient);

    jest.clearAllMocks();
  });

  describe("RefreshTokenRepository - create", () => {
    const mockCreateTokenDto: CreateTokenDto = {
      token: "valid-token",
      userId: "user-123",
    };

    it("should successfully create a refresh token", async () => {
      // Arrange
      const expectedToken = { ...mockCreateTokenDto, id: 1 };
      (mockPrismaClient.refreshToken.create as jest.Mock).mockResolvedValue(
        expectedToken
      );

      // Act
      const result = await repository.create(mockCreateTokenDto);

      // Assert
      expect(result).toEqual(expectedToken);
      expect(mockPrismaClient.refreshToken.create).toHaveBeenCalledWith({
        data: mockCreateTokenDto,
      });
    });

    it("should throw DatabaseError when creation fails", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.create as jest.Mock).mockRejectedValue(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_CREATE)
      );

      // Act & Assert
      await expect(repository.create(mockCreateTokenDto)).rejects.toThrow(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_CREATE)
      );
    });
  });

  describe("RefreshTokenRepository - find", () => {
    const mockToken = "valid-token";

    it("should successfully find a refresh token", async () => {
      // Arrange
      const expectedToken: RefreshToken = {
        id: "token_id_001",
        token: mockToken,
        userId: "user-123",
        createdAt: new Date(),
      };

      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        expectedToken
      );

      // Act
      const result = await repository.find(mockToken);

      // Assert
      expect(result).toEqual(expectedToken);
      expect(mockPrismaClient.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken },
      });
    });

    it("should return null when token is not found", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        null
      );

      // Act
      const result = await repository.find(mockToken);

      // Assert
      expect(result).toBeNull();
    });

    it("should throw DatabaseError when find operation fails", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockRejectedValue(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_FIND)
      );

      // Act & Assert
      await expect(repository.find(mockToken)).rejects.toThrow(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_FIND)
      );
    });
  });

  describe("RefreshTokenRepository - delete", () => {
    const mockToken = "valid-token";

    it("should successfully delete a refresh token", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.delete as jest.Mock).mockResolvedValue({
        id: "token_id_001",
        token: mockToken,
        userId: "user-123",
        createdAt: new Date(),
      });

      // Act & Assert
      await expect(repository.delete(mockToken)).resolves.not.toThrow();
      expect(mockPrismaClient.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: mockToken },
      });
    });

    it("should throw DatabaseError when delete operation fails", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.delete as jest.Mock).mockRejectedValue(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE)
      );

      // Act & Assert
      await expect(repository.delete(mockToken)).rejects.toThrow(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE)
      );
    });

    it("should throw DatabaseError when token does not exist", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.delete as jest.Mock).mockRejectedValue(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE)
      );

      // Act & Assert
      await expect(repository.delete(mockToken)).rejects.toThrow(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE)
      );
    });
  });

  describe("RefreshTokenRepository - deleteAll", () => {
    const mockUserId = "user-123";

    it("should successfully delete all refresh tokens for a user", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.deleteMany as jest.Mock).mockResolvedValue(
        { count: 5 }
      );

      // Act & Assert
      await expect(repository.deleteAll(mockUserId)).resolves.not.toThrow();

      expect(mockPrismaClient.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });

    it("should succeed even when no tokens exist for the user", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.deleteMany as jest.Mock).mockResolvedValue(
        { count: 0 }
      );

      // Act & Assert
      await expect(repository.deleteAll(mockUserId)).resolves.not.toThrow();
    });

    it("should throw DatabaseError when deleteMany operation fails", async () => {
      // Arrange
      (mockPrismaClient.refreshToken.deleteMany as jest.Mock).mockRejectedValue(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE_ALL)
      );

      // Act & Assert
      await expect(repository.deleteAll(mockUserId)).rejects.toThrow(
        new DatabaseError(ERROR_MESSAGES.FAILD_TO_DELETE_ALL)
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty string token", async () => {
      // Arrange
      const emptyToken = "";

      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        null
      );

      // Act
      const result = await repository.find(emptyToken);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle very long tokens", async () => {
      // Arrange
      const longToken = "a".repeat(1000);

      const expectedToken: RefreshToken = {
        id: "token_id_001",
        token: longToken,
        userId: "user-123",
        createdAt: new Date(),
      };

      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        expectedToken
      );

      // Act
      const result = await repository.find(longToken);

      // Assert
      expect(result).toEqual(expectedToken);
    });

    it("should handle special characters in token", async () => {
      // Arrange
      const specialToken = "!@#$%^&*()_+";
      const expectedToken: RefreshToken = {
        id: "token_id_001",
        token: specialToken,
        userId: "user-123",
        createdAt: new Date(),
      };

      (mockPrismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        expectedToken
      );

      // Act
      const result = await repository.find(specialToken);

      // Assert
      expect(result).toEqual(expectedToken);
    });
  });
});
