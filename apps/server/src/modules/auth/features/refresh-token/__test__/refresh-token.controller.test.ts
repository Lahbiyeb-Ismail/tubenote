import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/config/cookie.config";
import { UnauthorizedError } from "@/errors";
import type { LoginResponseDto } from "@/modules/auth/dtos/login-response.dto";
import type { TypedRequest } from "@/types";
import { REFRESH_TOKEN_NAME } from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import type { Response } from "express";
import httpStatus from "http-status";
import { RefreshTokenController } from "../refresh-token.controller";
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
    createToken: jest.fn(),
    deleteAllTokens: jest.fn(),
    findToken: jest.fn(),
    deleteToken: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockUserId = "test-user-id";
  const mockRefreshToken = "valid-refresh-token";

  const mockNewTokens: LoginResponseDto = {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
