import { Response } from "express";
import httpStatus from "http-status";

import { clearRefreshTokenCookieConfig } from "@config/cookie.config";

import { REFRESH_TOKEN_NAME } from "@constants/auth.contants";
import { AuthController } from "../auth.controller";

import type { TypedRequest } from "@/types";

import type { IAuthService } from "../auth.types";
import type { IAuthResponseDto, OAuthCodeDto } from "../dtos";

describe("AuthController", () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAuthService = {
      logoutUser: jest.fn(),
      exchangeOauthCodeForTokens: jest.fn(),
    };

    mockResponse = {
      clearCookie: jest.fn(),
      sendStatus: jest.fn(),
      json: jest.fn(),
      status: jest.fn(),
    };

    authController = new AuthController(mockAuthService);
  });

  describe("AuthController - logout", () => {
    const mockUserId = "user-id-123";
    const mockRefreshTokenValue = "refresh-token-123";

    let mockRequest: Partial<TypedRequest>;

    beforeEach(() => {
      mockRequest = {
        cookies: {
          [REFRESH_TOKEN_NAME]: mockRefreshTokenValue,
        },
        userId: mockUserId,
      };
    });

    it("should successfully logout user", async () => {
      await authController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: mockRefreshTokenValue,
        userId: mockUserId,
      });

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle missing refresh token cookie", async () => {
      mockRequest.cookies = {};

      await authController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: undefined,
        userId: mockUserId,
      });

      expect(mockResponse.clearCookie).toHaveBeenCalled();

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle service errors", async () => {
      const error = new Error("Logout failed");
      mockAuthService.logoutUser.mockRejectedValue(error);

      await expect(
        authController.logout(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockResponse.clearCookie).not.toHaveBeenCalled();
      expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    });

    it("should handle cookie clearing errors", async () => {
      mockResponse.clearCookie = jest.fn().mockImplementation(() => {
        throw new Error("Cookie clearing failed");
      });

      await expect(
        authController.logout(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow("Cookie clearing failed");

      expect(mockAuthService.logoutUser).toHaveBeenCalled();
      expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    });
  });

  describe("AuthController - exchangeOauthCodeForTokens", () => {
    let mockRequest: Partial<TypedRequest<OAuthCodeDto>>;

    const mockCode = "valid-code-123";

    const mockAuthResponse: IAuthResponseDto = {
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
    };

    beforeEach(() => {
      mockRequest = {
        body: { code: mockCode },
      };
    });

    it("should successfully exchange code for tokens", async () => {
      mockAuthService.exchangeOauthCodeForTokens.mockResolvedValue(
        mockAuthResponse
      );

      await authController.exchangeOauthCodeForTokens(
        mockRequest as TypedRequest<OAuthCodeDto>,
        mockResponse as Response
      );

      expect(mockAuthService.exchangeOauthCodeForTokens).toHaveBeenCalledWith(
        mockCode
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Access token exchanged successfully",
        accessToken: mockAuthResponse.accessToken,
      });
    });

    it("should handle service errors", async () => {
      const error = new Error("Token exchange failed");

      mockAuthService.exchangeOauthCodeForTokens.mockRejectedValue(error);

      await expect(
        authController.exchangeOauthCodeForTokens(
          mockRequest as TypedRequest<OAuthCodeDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should handle response errors", async () => {
      mockAuthService.exchangeOauthCodeForTokens.mockResolvedValue(
        mockAuthResponse
      );

      mockResponse.json = jest.fn().mockImplementation(() => {
        throw new Error("Response error");
      });

      await expect(
        authController.exchangeOauthCodeForTokens(
          mockRequest as TypedRequest<OAuthCodeDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Response error");
    });
  });
});
