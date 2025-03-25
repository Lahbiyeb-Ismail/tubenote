import { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { ICreateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import { refreshTokenCookieConfig } from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";
import type { User } from "@/modules/user";

import { LocalAuthController } from "../local-auth.controller";
import type { ILocalAuthService } from "../local-auth.types";

describe("LocalAuthController", () => {
  // Mock LocalAuthService
  const localAuthService = mock<ILocalAuthService>();

  const localAuthController = LocalAuthController.getInstance({
    localAuthService,
  });

  const registerReq = mock<TypedRequest<ICreateBodyDto<User>>>();

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

  const mockRegisterDto: ICreateBodyDto<User> = {
    email: "test@example.com",
    password: "Password123!",
    username: "Test User",
    isEmailVerified: false,
    profilePicture: null,
  };

  const mockLoginDto: ILoginDto = {
    email: "test@example.com",
    password: "Password123!",
  };

  const mockAuthResponse: IAuthResponseDto = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  beforeEach(() => {
    mockReset(localAuthService);

    registerReq.body = mockRegisterDto;
    loginReq.body = mockLoginDto;

    res.status.mockReturnThis();
    res.json.mockReturnThis();
    res.cookie.mockReturnThis();

    jest.clearAllMocks();
  });

  describe("LocalAuthController - register", () => {
    it("should successfully register a new user", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      await localAuthController.register(registerReq, res);

      expect(localAuthService.registerUser).toHaveBeenCalledWith({
        data: mockRegisterDto,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: "A verification email has been sent to your email.",
        email: mockUser.email,
      });
    });

    it("should handle registration service errors", async () => {
      const error = new Error("Registration failed");

      localAuthService.registerUser.mockRejectedValue(error);

      await expect(
        localAuthController.register(registerReq, res)
      ).rejects.toThrow(error);
    });
  });

  describe("LocalAuthController - login", () => {
    it("should successfully login a user", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      await localAuthController.login(loginReq, res);

      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto);
      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthResponse.refreshToken,
        refreshTokenCookieConfig
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        accessToken: mockAuthResponse.accessToken,
      });
    });

    it("should handle login service errors", async () => {
      const error = new Error("Login failed");
      localAuthService.loginUser.mockRejectedValue(error);

      await expect(localAuthController.login(loginReq, res)).rejects.toThrow(
        error
      );
    });

    it("should set refresh token cookie with correct configuration", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      await localAuthController.login(loginReq, res);

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthResponse.refreshToken,
        refreshTokenCookieConfig
      );
    });
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

  describe("LocalAuthController - response format", () => {
    it("should format registration response correctly", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      await localAuthController.register(registerReq, res);

      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        email: mockUser.email,
      });
    });

    it("should format login response correctly", async () => {
      localAuthService.loginUser.mockResolvedValue({
        accessToken: "token-123",
        refreshToken: "refresh-123",
      });

      await localAuthController.login(loginReq, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        accessToken: expect.any(String),
      });
    });
  });

  describe("LocalAuthController - Response Security", () => {
    it("should not include sensitive user data in registration response", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      await localAuthController.register(registerReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          password: expect.any(String),
          id: expect.any(String),
        })
      );
    });

    it("should not include sensitive data in login response", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      await localAuthController.login(loginReq, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          refreshToken: expect.any(String),
          password: expect.any(String),
        })
      );
    });
  });
});
