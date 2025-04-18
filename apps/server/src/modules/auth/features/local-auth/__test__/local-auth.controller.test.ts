import { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse, User } from "@tubenote/types";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import {
  AUTH_RATE_LIMIT_CONFIG,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import type { IAuthResponseDto } from "@/modules/auth/dtos";

import {
  BadRequestError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";

import { LocalAuthController } from "../local-auth.controller";

import type {
  ILocalAuthControllerOptions,
  ILocalAuthService,
} from "../local-auth.types";

describe("LocalAuthController", () => {
  let localAuthController: LocalAuthController;

  // Mock LocalAuthService
  const localAuthService = mock<ILocalAuthService>();
  const rateLimiter = mock<IRateLimitService>();
  const logger = mock<ILoggerService>();
  const responseFormatter = mock<IResponseFormatter>();

  const controllerOptions: ILocalAuthControllerOptions = {
    localAuthService,
    rateLimiter,
    logger,
    responseFormatter,
  };

  const registerReq = mock<TypedRequest<IRegisterDto>>();

  const loginReq = mock<TypedRequest<ILoginDto>>();

  // Mock response object
  const res = mock<Response>();

  const mockUser: User = {
    id: "user_id_001",
    email: "test@example.com",
    username: "Test User",
    password: "hashed-password",
    isEmailVerified: false,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterDto: IRegisterDto = {
    email: "test@example.com",
    password: "Password123!",
    username: "Test User",
  };

  const mockLoginDto: ILoginDto = {
    email: "test@example.com",
    password: "Password123!",
  };

  const mockAuthResponse: IAuthResponseDto = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  const formattedRegisterRes: IApiSuccessResponse<string> = {
    success: true,
    statusCode: httpStatus.CREATED,
    payload: {
      message: "A verification email has been sent to your email.",
      data: mockUser.email,
    },
  };

  const formattedLoginRes: IApiSuccessResponse<string> = {
    success: true,
    statusCode: httpStatus.OK,
    payload: {
      message: "Login successful",
      data: mockAuthResponse.accessToken,
    },
  };

  beforeEach(() => {
    mockReset(localAuthService);
    mockReset(responseFormatter);
    mockReset(rateLimiter);
    mockReset(logger);

    registerReq.body = mockRegisterDto;
    registerReq.rateLimitKey = `rate:register:ip:${registerReq.ip}`;

    loginReq.body = mockLoginDto;
    loginReq.rateLimitKey = `rate:login:ip:email:${loginReq.ip}-${loginReq.body.email}`;

    res.status.mockReturnThis();
    // Removed as res.statusCode is a number and cannot have mockReturnThis
    res.json.mockReturnThis();
    res.cookie.mockReturnThis();

    jest.clearAllMocks();

    // Reset singleton instance before each test to ensure a clean state.
    // @ts-ignore: resetting the private _instance for testing purposes
    LocalAuthController._instance = undefined;

    localAuthController = LocalAuthController.getInstance(controllerOptions);
  });

  describe("Singleton behavior", () => {
    it("should create a new instance when none exists", () => {
      const instance1 = LocalAuthController.getInstance(controllerOptions);
      expect(instance1).toBeInstanceOf(LocalAuthController);
    });

    it("should return the existing instance when called multiple times", () => {
      const instance1 = LocalAuthController.getInstance(controllerOptions);
      const instance2 = LocalAuthController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("LocalAuthController - register", () => {
    it("should successfully register a new user", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedRegisterRes
      );

      await localAuthController.register(registerReq, res);

      expect(localAuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterDto
      );
      expect(rateLimiter.reset).toHaveBeenCalledWith(registerReq.rateLimitKey);
      expect(responseFormatter.formatSuccessResponse).toHaveBeenCalledWith({
        responseOptions: {
          statusCode: httpStatus.CREATED,
          message: "A verification email has been sent to your email.",
          data: mockUser.email,
        },
      });
      expect(res.status).toHaveBeenCalledWith(formattedRegisterRes.statusCode);
      expect(res.json).toHaveBeenCalledWith(formattedRegisterRes);
    });

    it("should handle registration failure when service returns undefined", async () => {
      // Arrange
      localAuthService.registerUser.mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        localAuthController.register(registerReq, res)
      ).rejects.toThrow(BadRequestError);

      expect(localAuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterDto
      );

      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: registerReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.registration,
      });
    });

    it("should handle unexpected errors during registration", async () => {
      const error = new Error("Registration failed");

      localAuthService.registerUser.mockRejectedValue(error);

      await expect(
        localAuthController.register(registerReq, res)
      ).rejects.toThrow(error);
    });
  });

  describe("LocalAuthController - login", () => {
    it("should successfully login a user and set refresh token cookie", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes
      );

      await localAuthController.login(loginReq, res);

      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto);

      expect(rateLimiter.reset).toHaveBeenCalledWith(loginReq.rateLimitKey);

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthResponse.refreshToken,
        refreshTokenCookieConfig
      );

      expect(res.status).toHaveBeenCalledWith(formattedLoginRes.statusCode);

      expect(res.json).toHaveBeenCalledWith(formattedLoginRes);
    });

    it("should handle unexpected errors during login", async () => {
      // Arrange
      const unexpectedError = new Error("Database connection error");
      localAuthService.loginUser.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        unexpectedError
      );
      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto);
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: loginReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });
    });
  });

  describe("LocalAuthController - Rate Limiting", () => {
    it("should increment rate limiter on failed login attempts", async () => {
      // Arrange
      localAuthService.loginUser.mockRejectedValue(
        new UnauthorizedError("Invalid credentials")
      );

      // Act & Assert
      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        UnauthorizedError
      );
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: loginReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });
    });

    it("should increment rate limiter on failed registration attempts", async () => {
      localAuthService.registerUser.mockRejectedValue(
        new BadRequestError("Email already exists")
      );

      // Act & Assert
      await expect(
        localAuthController.register(registerReq, res)
      ).rejects.toThrow(BadRequestError);
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: registerReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.registration,
      });
    });

    it("should reset rate limiter on successful login", async () => {
      // Arrange
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes
      );

      // Act
      await localAuthController.login(loginReq, res);

      // Assert
      expect(rateLimiter.reset).toHaveBeenCalledWith(loginReq.rateLimitKey);
    });

    it("should reset rate limiter on successful registration", async () => {
      // Arrange
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedRegisterRes
      );

      // Act
      await localAuthController.register(registerReq, res);

      // Assert
      expect(rateLimiter.reset).toHaveBeenCalledWith(registerReq.rateLimitKey);
    });

    // it("should handle rate limiter errors gracefully", async () => {
    //   // Arrange
    //   localAuthService.loginUser.mockResolvedValue(mockAuthResponse);
    //   rateLimiter.reset.mockRejectedValue(new Error("Rate limiter error"));

    //   // Act & Assert
    //   // Even if rate limiter fails, the login should still succeed
    //   await localAuthController.login(loginReq, res);
    //   expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    // });
  });

  describe("LocalAuthController - error handling", () => {
    it("should maintain response chain when error occurs", async () => {
      const mockError = new Error("Test error");
      localAuthService.loginUser.mockRejectedValue(mockError);

      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        mockError
      );

      // Verify response methods weren't called after error
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe("LocalAuthController - Security Considerations", () => {
    it("should not expose sensitive user data in registration response", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedRegisterRes
      );

      await localAuthController.register(registerReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          password: expect.any(String),
          id: expect.any(String),
        })
      );
    });

    it("should not expose sensitive user data in login response", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes
      );

      await localAuthController.login(loginReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          refreshToken: expect.any(String),
          password: expect.any(String),
        })
      );
    });

    it("should set secure cookie options for refresh token", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes
      );
      // Act
      await localAuthController.login(loginReq, res);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "mock-refresh-token",
        refreshTokenCookieConfig
      );
      // Verify that the cookie config has secure settings
      expect(refreshTokenCookieConfig).toEqual(
        expect.objectContaining({
          httpOnly: true,
        })
      );
    });
  });

  describe("LocalAuthController - Brute Force Protection", () => {
    it("should implement rate limiting for failed login attempts", async () => {
      localAuthService.loginUser.mockRejectedValue(
        new UnauthorizedError("Invalid credentials")
      );

      // Act
      for (let i = 0; i < 3; i++) {
        await expect(
          localAuthController.login(loginReq, res)
        ).rejects.toThrow();
      }

      // Assert
      expect(rateLimiter.increment).toHaveBeenCalledTimes(3);
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: loginReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });
    });

    it("should implement rate limiting for failed registration attempts", async () => {
      localAuthService.registerUser.mockRejectedValue(
        new BadRequestError("Email already exists")
      );

      // Act
      for (let i = 0; i < 3; i++) {
        await expect(
          localAuthController.register(registerReq, res)
        ).rejects.toThrow();
      }

      // Assert
      expect(rateLimiter.increment).toHaveBeenCalledTimes(3);
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: registerReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.registration,
      });
    });
  });
});
