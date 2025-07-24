import type { User } from "@tubenote/db";
import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";
import type { CookieOptions, Response } from "express";

import {
  BadRequestError,
  UnauthorizedError,
} from "@tubenote/api-errors";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import {
  AUTH_RATE_LIMIT_CONFIG,
} from "@/modules/auth/config";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/modules/auth/constants";

import type {
  ILocalAuthService,
} from "../local-auth.types";

import { LocalAuthController } from "../local-auth.controller";

const mockRegisterDto: IRegisterDto = {
  email: "test@example.com",
  password: "Password123!",
  username: "testuser",
};

const mockLoginDto: ILoginDto = {
  email: "test@example.com",
  password: "Password123!",
};

const mockUserDeviceId = "test-device-id";
const mockUserIpAddress = "127.0.0.1";

const mockClientContext = {
  clientType: "web",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  username: "testuser",
  password: "hashedpassword",
  isEmailVerified: false,
  profilePicture: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  videoIds: [],
};

const mockAuthResponse: IAuthResponseDto = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
};

const registerReq = mock<TypedRequest<IRegisterDto>>();

const loginReq = mock<TypedRequest<ILoginDto>>();

const res = mock<Response>();

const formattedRegisterRes: IApiSuccessResponse<string> = {
  success: true,
  statusCode: httpStatus.CREATED,
  payload: {
    message: "A verification email has been sent to your email.",
    data: mockUser.email,
  },
};

const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

const accessTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

describe("localAuthController", () => {
  let localAuthController: LocalAuthController;

  // Mock LocalAuthService
  const localAuthService = mock<ILocalAuthService>();
  const rateLimiter = mock<IRateLimitService>();
  const logger = mock<ILoggerService>();
  const responseFormatter = mock<IResponseFormatter>();

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

    localAuthController = new LocalAuthController(
      localAuthService,
      rateLimiter,
      logger,
      responseFormatter,
    );
  });

  describe("localAuthController - register", () => {
    it("should successfully register a new user", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedRegisterRes,
      );

      await localAuthController.register(registerReq, res);

      expect(localAuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterDto,
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
        localAuthController.register(registerReq, res),
      ).rejects.toThrow(BadRequestError);

      expect(localAuthService.registerUser).toHaveBeenCalledWith(
        mockRegisterDto,
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
        localAuthController.register(registerReq, res),
      ).rejects.toThrow(error);
    });
  });

  describe("localAuthController - login", () => {
    it("should successfully login a user and set refresh token cookie", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes,
      );

      await localAuthController.login(loginReq, res);

      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto, mockUserDeviceId, mockUserIpAddress, mockClientContext);

      expect(rateLimiter.reset).toHaveBeenCalledWith(loginReq.rateLimitKey);

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthResponse.refreshToken,
        refreshTokenCookieConfig,
      );

      expect(res.cookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_NAME,
        mockAuthResponse.accessToken,
        accessTokenCookieConfig,
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
        unexpectedError,
      );

      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto, mockUserDeviceId, mockUserIpAddress, mockClientContext);

      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: loginReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });
    });
  });

  describe("localAuthController - Rate Limiting", () => {
    it("should increment rate limiter on failed login attempts", async () => {
      // Arrange
      localAuthService.loginUser.mockRejectedValue(
        new UnauthorizedError("Invalid credentials"),
      );

      // Act & Assert
      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        UnauthorizedError,
      );
      expect(rateLimiter.increment).toHaveBeenCalledWith({
        key: loginReq.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });
    });

    it("should increment rate limiter on failed registration attempts", async () => {
      localAuthService.registerUser.mockRejectedValue(
        new BadRequestError("Email already exists"),
      );

      // Act & Assert
      await expect(
        localAuthController.register(registerReq, res),
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
        formattedLoginRes,
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
        formattedRegisterRes,
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

  describe("localAuthController - error handling", () => {
    it("should maintain response chain when error occurs", async () => {
      const mockError = new Error("Test error");
      localAuthService.loginUser.mockRejectedValue(mockError);

      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        mockError,
      );

      // Verify response methods weren't called after error
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe("localAuthController - Security Considerations", () => {
    it("should not expose sensitive user data in registration response", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedRegisterRes,
      );

      await localAuthController.register(registerReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          password: expect.any(String),
          id: expect.any(String),
        }),
      );
    });

    it("should not expose sensitive user data in login response", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedLoginRes,
      );

      await localAuthController.login(loginReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          refreshToken: expect.any(String),
          password: expect.any(String),
        }),
      );
    });
  });

  describe("localAuthController - Brute Force Protection", () => {
    it("should implement rate limiting for failed login attempts", async () => {
      localAuthService.loginUser.mockRejectedValue(
        new UnauthorizedError("Invalid credentials"),
      );

      // Act
      for (let i = 0; i < 3; i++) {
        await expect(
          localAuthController.login(loginReq, res),
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
        new BadRequestError("Email already exists"),
      );

      // Act
      for (let i = 0; i < 3; i++) {
        await expect(
          localAuthController.register(registerReq, res),
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
