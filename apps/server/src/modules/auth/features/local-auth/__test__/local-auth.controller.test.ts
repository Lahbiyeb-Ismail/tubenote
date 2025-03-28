import { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { ICreateBodyDto } from "@/modules/shared/dtos";
import type {
  IApiResponse,
  IResponseFormatter,
} from "@/modules/shared/services";
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
  const responseFormatter = mock<IResponseFormatter>();

  const localAuthController = LocalAuthController.getInstance({
    localAuthService,
    responseFormatter,
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
    mockReset(responseFormatter);

    registerReq.body = mockRegisterDto;
    loginReq.body = mockLoginDto;

    res.status.mockReturnThis();
    res.json.mockReturnThis();
    res.cookie.mockReturnThis();

    jest.clearAllMocks();
  });

  describe("LocalAuthController - register", () => {
    const formattedRegisterRes: IApiResponse<{ email: string }> = {
      success: true,
      status: httpStatus.CREATED,
      message: "A verification email has been sent to your email.",
      data: { email: mockUser.email },
    };

    it("should successfully register a new user", async () => {
      localAuthService.registerUser.mockResolvedValue(mockUser);

      responseFormatter.formatResponse.mockReturnValue(formattedRegisterRes);

      await localAuthController.register(registerReq, res);

      expect(localAuthService.registerUser).toHaveBeenCalledWith({
        data: mockRegisterDto,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(formattedRegisterRes);
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
    const formattedLoginRes: IApiResponse<{ accessToken: string }> = {
      success: true,
      status: httpStatus.OK,
      message: "Login successful",
      data: { accessToken: mockAuthResponse.accessToken },
    };

    it("should successfully login a user and set refresh token cookie", async () => {
      localAuthService.loginUser.mockResolvedValue(mockAuthResponse);

      responseFormatter.formatResponse.mockReturnValue(formattedLoginRes);

      await localAuthController.login(loginReq, res);

      expect(localAuthService.loginUser).toHaveBeenCalledWith(mockLoginDto);

      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        mockAuthResponse.refreshToken,
        refreshTokenCookieConfig
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(formattedLoginRes);
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
