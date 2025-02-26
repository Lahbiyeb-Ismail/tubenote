import { Response } from "express";

import type { TypedRequest } from "@/types";

import { refreshTokenCookieConfig } from "@/config/cookie.config";
import envConfig from "@/config/env.config";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";

import { UnauthorizedError } from "@modules/shared";

import { type OAuthResponseDto, REFRESH_TOKEN_NAME } from "@modules/auth";

import type { User } from "@/modules/user";

import { GoogleController } from "../google.controller";
import type { IGoogleAuthService } from "../google.types";

describe("GoogleController", () => {
  let googleController: GoogleController;
  let mockGoogleAuthService: jest.Mocked<IGoogleAuthService>;
  let mockRequest: Partial<TypedRequest>;
  let mockResponse: Partial<Response>;

  const mockUser: User = {
    id: "user-id-123",
    username: "test user",
    email: "user@test.com",
    password: "password123!",
    googleId: "google-id-123",
    profilePicture: "google-profile-picture",
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockGoogleAuthService = {
      googleLogin: jest.fn(),
      generateTemporaryCode: jest.fn(),
    };

    mockRequest = {
      user: mockUser,
    };

    mockResponse = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    };

    googleController = new GoogleController(mockGoogleAuthService);
  });

  describe("GoogleController - googleLogin", () => {
    const mockOAuthResponse: OAuthResponseDto = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      temporaryCode: "mock-temporary-code",
    };

    it("should successfully handle Google login and set cookies", async () => {
      mockGoogleAuthService.googleLogin.mockResolvedValue(mockOAuthResponse);

      await googleController.googleLogin(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      // Verify refresh token cookie was set
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockOAuthResponse.refreshToken,
        refreshTokenCookieConfig
      );

      // Verify redirect was called with correct URL
      const expectedRedirectUrl = `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(
        mockOAuthResponse.temporaryCode
      )}`;
      expect(mockResponse.redirect).toHaveBeenCalledWith(expectedRedirectUrl);
    });

    it("should throw UnauthorizedError if req.user is not present", async () => {
      mockRequest.user = undefined;

      await expect(
        googleController.googleLogin(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle errors from googleAuthService", async () => {
      const error = new Error("Service error");

      mockGoogleAuthService.googleLogin.mockRejectedValue(error);

      await expect(
        googleController.googleLogin(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle cookie setting errors", async () => {
      mockGoogleAuthService.googleLogin.mockResolvedValue(mockOAuthResponse);

      mockResponse.cookie = jest.fn().mockImplementation(() => {
        throw new Error("Cookie setting error");
      });

      await expect(
        googleController.googleLogin(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow("Cookie setting error");

      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle redirect errors", async () => {
      mockGoogleAuthService.googleLogin.mockResolvedValue(mockOAuthResponse);

      mockResponse.redirect = jest.fn().mockImplementation(() => {
        throw new Error("Redirect error");
      });

      await expect(
        googleController.googleLogin(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow("Redirect error");

      expect(mockResponse.cookie).toHaveBeenCalled();
    });

    it("should properly encode temporary code in redirect URL", async () => {
      const specialCode = "code with spaces & special chars!";

      mockGoogleAuthService.googleLogin.mockResolvedValue({
        ...mockOAuthResponse,
        temporaryCode: specialCode,
      });

      await googleController.googleLogin(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      const expectedRedirectUrl = `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(
        specialCode
      )}`;
      expect(mockResponse.redirect).toHaveBeenCalledWith(expectedRedirectUrl);
    });
  });
});
