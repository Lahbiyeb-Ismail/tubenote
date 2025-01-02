import type { Response } from "express";
import httpStatus from "http-status";

import type { UserEntry } from "../../src/modules/user/user.type";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../src/config/cookie.config";
import envConfig from "../../src/config/envConfig";
import { REFRESH_TOKEN_NAME } from "../../src/constants/auth";
import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { UnauthorizedError } from "../../src/errors";
import type {
  GoogleUser,
  LoginCredentials,
  LoginParams,
  RegisterCredentials,
  RegisterParams,
} from "../../src/modules/auth/auth.type";
import AuthController from "../../src/modules/auth/authController";
import AuthService from "../../src/modules/auth/authService";
import type { TypedRequest } from "../../src/types";

jest.mock("../../src/modules/auth/authService");

describe("AuthController integration tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("AuthController - register", () => {
    let mockRequest: Partial<TypedRequest<RegisterCredentials>>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    const mockUser: UserEntry = {
      id: "user_id_001",
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      createdAt: new Date(),
      updatedAt: new Date(),
      videoIds: [],
    };

    const mockRegisterCredentials: RegisterParams = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      };
      mockRequest = {
        body: mockRegisterCredentials,
      };
      jest.clearAllMocks();
    });

    it("should successfully register a new user", async () => {
      (AuthService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      await AuthController.register(
        mockRequest as TypedRequest<RegisterCredentials>,
        mockResponse as Response
      );

      expect(AuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterCredentials
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "A verification email has been sent to your email.",
        email: mockUser.email,
      });
    });

    it("should handle AuthService errors", async () => {
      const errorMessage = "Registration failed";

      (AuthService.registerUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        AuthController.register(
          mockRequest as TypedRequest<RegisterCredentials>,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("AuthController - login", () => {
    let mockRequest: Partial<TypedRequest<LoginCredentials>>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockCookie: jest.Mock;

    const mockLoginCredentials: LoginParams = {
      email: "testuser@example.com",
      password: "password123",
    };

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockCookie = jest.fn();
      mockResponse = {
        status: mockStatus,
        cookie: mockCookie,
        json: mockJson,
      };
      mockRequest = {
        body: mockLoginCredentials,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully log in a user", async () => {
      const mockTokens = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      };

      (AuthService.loginUser as jest.Mock).mockResolvedValue(mockTokens);

      await AuthController.login(
        mockRequest as TypedRequest<LoginCredentials>,
        mockResponse as Response
      );

      expect(AuthService.loginUser).toHaveBeenCalledWith(mockLoginCredentials);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "mock-refresh-token",
        refreshTokenCookieConfig
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Login successful",
        accessToken: "mock-access-token",
      });
    });

    it("should handle AuthService errors", async () => {
      const errorMessage = "Invalid credentials";
      (AuthService.loginUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        AuthController.login(
          mockRequest as TypedRequest<LoginCredentials>,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("AuthController - logout", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockClearCookie: jest.Mock;
    let mockSendStatus: jest.Mock;

    beforeEach(() => {
      mockClearCookie = jest.fn();
      mockSendStatus = jest.fn();
      mockResponse = {
        clearCookie: mockClearCookie,
        sendStatus: mockSendStatus,
      };
      mockRequest = {
        cookies: {
          [REFRESH_TOKEN_NAME]: "mock-refresh-token",
        },
        userId: "mock-user-id",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully log out a user", async () => {
      (AuthService.logoutUser as jest.Mock).mockResolvedValue(undefined);

      await AuthController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(AuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: "mock-refresh-token",
        userId: "mock-user-id",
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle missing refresh token", async () => {
      mockRequest.cookies = {};

      await AuthController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(AuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: undefined,
        userId: "mock-user-id",
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle AuthService errors", async () => {
      const errorMessage = "Logout failed";
      (AuthService.logoutUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        AuthController.logout(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("AuthController - refresh", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockClearCookie: jest.Mock;
    let mockCookie: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    const mockTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    beforeEach(() => {
      mockClearCookie = jest.fn();
      mockCookie = jest.fn();
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockResponse = {
        clearCookie: mockClearCookie,
        cookie: mockCookie,
        status: mockStatus,
        json: mockJson,
      };
      mockRequest = {
        cookies: {
          [REFRESH_TOKEN_NAME]: "mock-refresh-token",
        },
        userId: "mock-user-id",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully refresh the access token", async () => {
      (AuthService.refreshToken as jest.Mock).mockResolvedValue(mockTokens);

      await AuthController.refresh(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(AuthService.refreshToken).toHaveBeenCalledWith({
        token: "mock-refresh-token",
        userId: "mock-user-id",
      });

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "mock-refresh-token",
        refreshTokenCookieConfig
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        accessToken: "mock-access-token",
      });
    });

    it("should handle missing refresh token", async () => {
      mockRequest.cookies = {};

      await expect(
        AuthController.refresh(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockResponse.clearCookie).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should handle AuthService errors", async () => {
      const errorMessage = "Refresh token failed";
      (AuthService.refreshToken as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        AuthController.refresh(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
    });
  });

  describe("AuthController - loginWithGoogle", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockCookie: jest.Mock;
    let mockRedirect: jest.Mock;

    const mockTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    const mockGoogleUser: GoogleUser = {
      sub: "google_user_id",
      email: "testuser@example.com",
      name: "Test User",
      picture: "http://example.com/picture.jpg",
      email_verified: true,
      given_name: "Test",
      family_name: "User",
    };

    const mockProfile = {
      _json: mockGoogleUser,
    };

    beforeEach(() => {
      mockCookie = jest.fn();
      mockRedirect = jest.fn();
      mockResponse = {
        cookie: mockCookie,
        redirect: mockRedirect,
      };
      mockRequest = {
        user: mockProfile,
      };
      jest.clearAllMocks();
    });

    it("should successfully log in a user with Google", async () => {
      (AuthService.googleLogin as jest.Mock).mockResolvedValue(mockTokens);

      await AuthController.loginWithGoogle(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(AuthService.googleLogin).toHaveBeenCalledWith(mockProfile._json);

      expect(mockCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "mock-refresh-token",
        refreshTokenCookieConfig
      );

      expect(mockRedirect).toHaveBeenCalledWith(
        `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(
          JSON.stringify(mockTokens.accessToken)
        )}`
      );
    });

    it("should handle AuthService errors", async () => {
      const errorMessage = "Google login failed";
      (AuthService.googleLogin as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        AuthController.loginWithGoogle(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);

      expect(mockCookie).not.toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
});
