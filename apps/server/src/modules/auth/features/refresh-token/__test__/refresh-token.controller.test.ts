import type { Response } from "express";
import httpStatus from "http-status";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/config/cookie.config";

import { BadRequestError, ForbiddenError, UnauthorizedError } from "@/errors";
import { REFRESH_TOKEN_NAME } from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { AuthResponseDto } from "@/modules/auth/dtos";

import type { TypedRequest } from "@/types";

import { RefreshTokenController } from "../refresh-token.controller";

import envConfig from "@/config/env.config";
import type {
  IRefreshTokenController,
  IRefreshTokenService,
} from "../refresh-token.types";

describe("RefreshTokenController", () => {
  let refreshTokenController: IRefreshTokenController;
  let mockRequest: Partial<TypedRequest>;
  let mockResponse: Partial<Response>;

  // Mock the refresh token service
  const mockRefreshTokenService: jest.Mocked<IRefreshTokenService> = {
    saveToken: jest.fn(),
    deleteAllTokens: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockUserId = "test-user-id";
  const mockRefreshToken = "valid-refresh-token";

  const mockNewTokens: AuthResponseDto = {
    accessToken: "new-access-token",
    refreshToken: "new-refresh-token",
  };

  beforeEach(() => {
    // Create controller instance
    refreshTokenController = new RefreshTokenController(
      mockRefreshTokenService
    );

    // Mock request object
    mockRequest = {
      cookies: {},
      userId: mockUserId,
    };

    // Mock response object
    mockResponse = {
      clearCookie: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis(),
    };
  });

  describe("RefreshTokenController - refreshToken", () => {
    it("should successfully refresh tokens when valid refresh token is provided", async () => {
      mockRequest.cookies = {
        [REFRESH_TOKEN_NAME]: mockRefreshToken,
      };

      mockRefreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      // Act
      await refreshTokenController.refreshToken(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockRefreshTokenService.refreshToken).toHaveBeenCalledWith({
        token: mockRefreshToken,
        userId: mockUserId,
      });

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockNewTokens.refreshToken,
        refreshTokenCookieConfig
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        accessToken: mockNewTokens.accessToken,
      });
    });

    it.each([
      { scenario: "refresh token is not provided", cookies: {} },
      {
        scenario: "refresh token is an empty string",
        cookies: { [REFRESH_TOKEN_NAME]: "" },
      },
    ])("should throw UnauthorizedError when $scenario", async ({ cookies }) => {
      mockRequest.cookies = cookies;

      await expect(
        refreshTokenController.refreshToken(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    });

    it("should throw error and clear refresh token cookie when refresh token service fails", async () => {
      // Arrange
      const mockRefreshToken = "valid-refresh-token";
      const mockError = new Error("Service error");

      mockRequest.cookies = {
        [REFRESH_TOKEN_NAME]: mockRefreshToken,
      };

      mockRefreshTokenService.refreshToken.mockRejectedValue(mockError);

      // Act
      await expect(
        refreshTokenController.refreshToken(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(mockError);

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
    });

    it("should handle non-string refresh token values", async () => {
      mockRequest.cookies = {
        [REFRESH_TOKEN_NAME]: [123, "invalid"] as unknown as string,
      };

      await expect(
        refreshTokenController.refreshToken(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(UnauthorizedError);

      expect(mockResponse.clearCookie).toHaveBeenCalled();
    });

    it("should handle multiple concurrent refresh attempts", async () => {
      mockRequest.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };

      // First attempt
      mockRefreshTokenService.refreshToken.mockResolvedValueOnce(mockNewTokens);

      await refreshTokenController.refreshToken(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      // Second concurrent attempt with same token
      mockRefreshTokenService.refreshToken.mockRejectedValueOnce(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );
      await expect(
        refreshTokenController.refreshToken(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it("should handle malformed JWT tokens", async () => {
      const malformedTokens = [
        "invalid.token.structure",
        "a".repeat(500), // Long invalid token
        "header.payload.signature", // Proper structure but invalid
      ];

      for (const token of malformedTokens) {
        mockRequest.cookies = { [REFRESH_TOKEN_NAME]: token };
        mockRefreshTokenService.refreshToken.mockRejectedValue(
          new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN)
        );

        await expect(
          refreshTokenController.refreshToken(
            mockRequest as TypedRequest,
            mockResponse as Response
          )
        ).rejects.toThrow(BadRequestError);
      }
    });

    it("should maintain cookie consistency after multiple operations", async () => {
      // First successful refresh
      mockRequest.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };

      mockRefreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      await refreshTokenController.refreshToken(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      // Subsequent request with new token
      mockRequest.cookies = {
        [REFRESH_TOKEN_NAME]: mockNewTokens.refreshToken,
      };

      mockRefreshTokenService.refreshToken.mockResolvedValue({
        accessToken: "another-access-token",
        refreshToken: "another-refresh-token",
      });

      await refreshTokenController.refreshToken(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(4);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });

    it("should validate cookie security configurations", async () => {
      mockRequest.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };
      mockRefreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      await refreshTokenController.refreshToken(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockNewTokens.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: envConfig.node_env === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        })
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
