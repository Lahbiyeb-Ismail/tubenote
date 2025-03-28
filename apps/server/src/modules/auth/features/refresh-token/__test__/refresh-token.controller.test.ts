import type { Response } from "express";
import httpStatus from "http-status";

import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { envConfig } from "@/modules/shared/config";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { TypedRequest } from "@/modules/shared/types";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";

import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";
import type { IAuthResponseDto } from "@/modules/auth/dtos";

import { RefreshTokenController } from "../refresh-token.controller";

import type {
  IApiResponse,
  IResponseFormatter,
} from "@/modules/shared/services";
import { mock, mockReset } from "jest-mock-extended";
import type { IRefreshTokenService } from "../refresh-token.types";

describe("RefreshTokenController", () => {
  // Mock the refresh token service
  const refreshTokenService = mock<IRefreshTokenService>();
  const responseFormatter = mock<IResponseFormatter>();

  const refreshTokenController = RefreshTokenController.getInstance({
    refreshTokenService,
    responseFormatter,
  });

  const req = mock<TypedRequest>();
  const res = mock<Response>();

  const mockUserId = "test-user-id";
  const mockRefreshToken = "valid-refresh-token";

  const mockNewTokens: IAuthResponseDto = {
    accessToken: "new-access-token",
    refreshToken: "new-refresh-token",
  };

  beforeEach(() => {
    mockReset(refreshTokenService);
    mockReset(responseFormatter);

    // Mock request object
    req.cookies = {};
    req.userId = mockUserId;

    // Mock response object
    res.clearCookie.mockReturnThis();
    res.cookie.mockReturnThis();
    res.status.mockReturnThis();
    res.json.mockReturnThis();
    res.header.mockReturnThis();
  });

  describe("RefreshTokenController - refreshToken", () => {
    const formattedResponse: IApiResponse<{ accessToken: string }> = {
      success: true,
      status: httpStatus.OK,
      data: { accessToken: mockNewTokens.accessToken },
      message: "Access token refreshed successfully.",
    };

    it("should successfully refresh tokens when valid refresh token is provided", async () => {
      req.cookies = {
        [REFRESH_TOKEN_NAME]: mockRefreshToken,
      };

      refreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      responseFormatter.formatResponse.mockReturnValue(formattedResponse);

      // Act
      await refreshTokenController.refreshToken(req, res);

      // Assert
      expect(refreshTokenService.refreshToken).toHaveBeenCalledWith({
        token: mockRefreshToken,
        userId: mockUserId,
      });

      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockNewTokens.refreshToken,
        refreshTokenCookieConfig
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(formattedResponse);
    });

    it.each([
      { scenario: "refresh token is not provided", cookies: {} },
      {
        scenario: "refresh token is an empty string",
        cookies: { [REFRESH_TOKEN_NAME]: "" },
      },
    ])("should throw UnauthorizedError when $scenario", async ({ cookies }) => {
      req.cookies = cookies;

      await expect(
        refreshTokenController.refreshToken(req, res)
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    });

    it("should throw error and clear refresh token cookie when refresh token service fails", async () => {
      // Arrange
      const mockRefreshToken = "valid-refresh-token";
      const mockError = new Error("Service error");

      req.cookies = {
        [REFRESH_TOKEN_NAME]: mockRefreshToken,
      };

      refreshTokenService.refreshToken.mockRejectedValue(mockError);

      // Act
      await expect(
        refreshTokenController.refreshToken(req, res)
      ).rejects.toThrow(mockError);

      // Assert
      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
    });

    it("should handle non-string refresh token values", async () => {
      req.cookies = {
        [REFRESH_TOKEN_NAME]: [123, "invalid"] as unknown as string,
      };

      await expect(
        refreshTokenController.refreshToken(req, res)
      ).rejects.toThrow(UnauthorizedError);

      expect(res.clearCookie).toHaveBeenCalled();
    });

    it("should handle multiple concurrent refresh attempts", async () => {
      req.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };

      // First attempt
      refreshTokenService.refreshToken.mockResolvedValueOnce(mockNewTokens);

      await refreshTokenController.refreshToken(req, res);

      // Second concurrent attempt with same token
      refreshTokenService.refreshToken.mockRejectedValueOnce(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );
      await expect(
        refreshTokenController.refreshToken(req, res)
      ).rejects.toThrow(ForbiddenError);
    });

    it("should handle malformed JWT tokens", async () => {
      const malformedTokens = [
        "invalid.token.structure",
        "a".repeat(500), // Long invalid token
        "header.payload.signature", // Proper structure but invalid
      ];

      for (const token of malformedTokens) {
        req.cookies = { [REFRESH_TOKEN_NAME]: token };
        refreshTokenService.refreshToken.mockRejectedValue(
          new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN)
        );

        await expect(
          refreshTokenController.refreshToken(req, res)
        ).rejects.toThrow(BadRequestError);
      }
    });

    it("should maintain cookie consistency after multiple operations", async () => {
      // First successful refresh
      req.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };

      refreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      responseFormatter.formatResponse.mockReturnValue(formattedResponse);

      await refreshTokenController.refreshToken(req, res);

      // Subsequent request with new token
      req.cookies = {
        [REFRESH_TOKEN_NAME]: mockNewTokens.refreshToken,
      };

      refreshTokenService.refreshToken.mockResolvedValue({
        accessToken: "another-access-token",
        refreshToken: "another-refresh-token",
      });

      await refreshTokenController.refreshToken(req, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(4);
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });

    it("should validate cookie security configurations", async () => {
      req.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };
      refreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      responseFormatter.formatResponse.mockReturnValue(formattedResponse);

      await refreshTokenController.refreshToken(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
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
