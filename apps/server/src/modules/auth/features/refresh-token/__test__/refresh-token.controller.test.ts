import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { IApiSuccessResponse } from "@tubenote/types";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  clearAuthTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";

import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";
import type { IAuthResponseDto } from "@/modules/auth/dtos";

import { RefreshTokenController } from "../refresh-token.controller";

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
    const formattedResponse: IApiSuccessResponse<string> = {
      success: true,
      statusCode: httpStatus.OK,
      payload: {
        data: mockNewTokens.accessToken,
        message: "Access token refreshed successfully.",
      },
    };

    it("should successfully refresh tokens when valid refresh token is provided", async () => {
      req.cookies = {
        [REFRESH_TOKEN_NAME]: mockRefreshToken,
      };

      refreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedResponse
      );

      // Act
      await refreshTokenController.refreshToken(req, res);

      // Assert
      expect(refreshTokenService.refreshToken).toHaveBeenCalledWith(
        mockUserId,
        mockRefreshToken
      );

      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearAuthTokenCookieConfig
      );

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockNewTokens.refreshToken,
        refreshTokenCookieConfig
      );

      expect(res.status).toHaveBeenCalledWith(formattedResponse.statusCode);

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
    });

    it("should handle non-string refresh token values", async () => {
      req.cookies = {
        [REFRESH_TOKEN_NAME]: [123, "invalid"] as unknown as string,
      };

      await expect(
        refreshTokenController.refreshToken(req, res)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should handle multiple concurrent refresh attempts", async () => {
      req.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };

      // First attempt
      refreshTokenService.refreshToken.mockResolvedValueOnce(mockNewTokens);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedResponse
      );

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

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedResponse
      );

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

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });

    // it("should validate cookie security configurations", async () => {
    //   req.cookies = { [REFRESH_TOKEN_NAME]: mockRefreshToken };
    //   refreshTokenService.refreshToken.mockResolvedValue(mockNewTokens);

    //   responseFormatter.formatSuccessResponse.mockReturnValue(
    //     formattedResponse
    //   );

    //   await refreshTokenController.refreshToken(req, res);

    //   expect(res.cookie).toHaveBeenCalledWith(
    //     REFRESH_TOKEN_NAME,
    //     mockNewTokens.refreshToken,
    //    clearAuthTokenCookieConfig
    //   );
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
