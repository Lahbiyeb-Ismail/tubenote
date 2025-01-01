import type { Response } from "express";
import httpStatus from "http-status";
import request from "supertest";

import type { UserEntry } from "../../src/modules/user/user.type";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../src/config/cookie.config";
import { REFRESH_TOKEN_NAME } from "../../src/constants/auth";
import type {
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

      expect(mockStatus).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockJson).toHaveBeenCalledWith({
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

      expect(mockCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "mock-refresh-token",
        refreshTokenCookieConfig
      );

      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
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
      expect(mockClearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockSendStatus).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
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
      expect(mockClearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockSendStatus).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
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
});
