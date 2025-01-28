import type { Response } from "express";
import httpStatus from "http-status";

import { refreshTokenCookieConfig } from "@config/cookie.config";
import { REFRESH_TOKEN_NAME } from "@constants/auth.contants";

import { LocalAuthController } from "../local-auth.controller";

import type { TypedRequest } from "@/types";

import type { LoginDto, RegisterDto } from "@/modules/auth/dtos";
import type { User } from "@/modules/user/user.model";

describe("LocalAuthController", () => {
  // Mock LocalAuthService
  const mockLocalAuthService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };

  const mockUser: User = {
    id: "user_id_001",
    email: "test@example.com",
    username: "Test User",
    password: "hashed-password",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock response object
  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  let localAuthController: LocalAuthController;
  let res: Response;

  beforeEach(() => {
    localAuthController = new LocalAuthController(mockLocalAuthService);
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("LocalAuthController - register", () => {
    const mockRegisterDto: RegisterDto = {
      email: "test@example.com",
      password: "Password123!",
      username: "Test User",
    };

    const mockRequest = {
      body: mockRegisterDto,
    } as TypedRequest<RegisterDto>;

    it("should successfully register a new user", async () => {
      mockLocalAuthService.registerUser.mockResolvedValue(mockUser);

      await localAuthController.register(mockRequest, res);

      expect(mockLocalAuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterDto
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: "A verification email has been sent to your email.",
        email: mockUser.email,
      });
    });

    it("should handle registration service errors", async () => {
      const error = new Error("Registration failed");

      mockLocalAuthService.registerUser.mockRejectedValue(error);

      await expect(
        localAuthController.register(mockRequest, res)
      ).rejects.toThrow(error);
    });
  });

  describe("LocalAuthController - login", () => {
    const mockLoginDto: LoginDto = {
      email: "test@example.com",
      password: "Password123!",
    };

    const mockRequest = {
      body: mockLoginDto,
    } as TypedRequest<LoginDto>;

    const mockAuthTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    it("should successfully login a user", async () => {
      mockLocalAuthService.loginUser.mockResolvedValue(mockAuthTokens);

      await localAuthController.login(mockRequest, res);

      expect(mockLocalAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto);
      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthTokens.refreshToken,
        refreshTokenCookieConfig
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        accessToken: mockAuthTokens.accessToken,
      });
    });

    it("should handle login service errors", async () => {
      const error = new Error("Login failed");
      mockLocalAuthService.loginUser.mockRejectedValue(error);

      await expect(localAuthController.login(mockRequest, res)).rejects.toThrow(
        error
      );
    });

    it("should set refresh token cookie with correct configuration", async () => {
      mockLocalAuthService.loginUser.mockResolvedValue(mockAuthTokens);

      await localAuthController.login(mockRequest, res);

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthTokens.refreshToken,
        refreshTokenCookieConfig
      );
    });

    it("should not expose refresh token in response body", async () => {
      mockLocalAuthService.loginUser.mockResolvedValue(mockAuthTokens);

      await localAuthController.login(mockRequest, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          refreshToken: expect.any(String),
        })
      );
    });
  });

  describe("LocalAuthController - error handling", () => {
    it("should maintain response chain when error occurs", async () => {
      const mockError = new Error("Test error");
      mockLocalAuthService.loginUser.mockRejectedValue(mockError);

      const mockReq = {
        body: { email: "test@example.com", password: "password" },
      } as TypedRequest<any>;

      await expect(localAuthController.login(mockReq, res)).rejects.toThrow(
        mockError
      );

      // Verify response methods weren't called after error
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe("LocalAuthController - response format", () => {
    it("should format registration response correctly", async () => {
      mockLocalAuthService.registerUser.mockResolvedValue(mockUser);

      await localAuthController.register(
        {
          body: { email: "test@example.com", password: "password" },
        } as TypedRequest<any>,
        res
      );

      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        email: mockUser.email,
      });
    });

    it("should format login response correctly", async () => {
      mockLocalAuthService.loginUser.mockResolvedValue({
        accessToken: "token-123",
        refreshToken: "refresh-123",
      });

      await localAuthController.login(
        {
          body: { email: "test@example.com", password: "password" },
        } as TypedRequest<any>,
        res
      );

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        accessToken: expect.any(String),
      });
    });
  });
});
