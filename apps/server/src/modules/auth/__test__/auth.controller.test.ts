import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import {
  type IAuthControllerOptions,
  REFRESH_TOKEN_NAME,
  clearRefreshTokenCookieConfig,
} from "@/modules/auth";

import { AuthController, IAuthService } from "@/modules/auth";
import type { IApiResponse } from "@tubenote/types";

describe("AuthController", () => {
  let controller: AuthController;
  const authService = mock<IAuthService>();
  const responseFormatter = mock<IResponseFormatter>();

  const req = mock<TypedRequest>();
  const res = mock<Response>();

  const controllerOptions: IAuthControllerOptions = {
    authService,
    responseFormatter,
  };

  const MOCK_USER_ID = "user-id-123";
  const MOCK_REFRESH_TOKEN_VALUE = "refresh-token-123";

  beforeEach(() => {
    mockReset(authService);
    mockReset(responseFormatter);

    // Create a fresh mock for authService.logoutUser.
    authService.logoutUser.mockResolvedValue(undefined);

    // Reset singleton instance for isolation.
    // @ts-ignore: Resetting private static property for testing purposes.
    AuthController._instance = undefined;

    // Initialize the controller instance.
    controller = AuthController.getInstance(controllerOptions);

    req.cookies = {
      [REFRESH_TOKEN_NAME]: MOCK_REFRESH_TOKEN_VALUE,
    };

    req.userId = MOCK_USER_ID;

    res.clearCookie.mockReturnThis();
    res.sendStatus.mockReturnThis();
    res.json.mockReturnThis();
    res.status.mockReturnThis();
  });

  describe("Singleton Behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = AuthController.getInstance(controllerOptions);
      expect(instance).toBeInstanceOf(AuthController);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = AuthController.getInstance(controllerOptions);
      const instance2 = AuthController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("logout", () => {
    const formattedResponse: IApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "User logged out successfully.",
    };

    it("should call logoutUser with correct parameters, clear the refresh token cookie, and send OK status", async () => {
      // Arrange: mock the response formatter to return the expected response.
      responseFormatter.formatResponse.mockReturnValue(formattedResponse);

      // Act
      await controller.logout(req, res);

      // Assert
      expect(authService.logoutUser).toHaveBeenCalledWith({
        refreshToken: MOCK_REFRESH_TOKEN_VALUE,
        userId: MOCK_USER_ID,
      });
      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(res.json).toHaveBeenCalledWith(formattedResponse);
    });

    it("should propagate errors if logoutUser fails", async () => {
      // Arrange: simulate an error in logoutUser.
      const error = new Error("Logout failed");
      authService.logoutUser.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.logout(req, res)).rejects.toThrow(
        "Logout failed"
      );

      expect(res.clearCookie).toHaveBeenCalled();
    });

    it("should pass undefined refreshToken if cookie is missing", async () => {
      // Arrange: remove the refresh token from cookies.
      req.cookies = {};

      // Arrange: mock the response formatter to return the expected response.
      responseFormatter.formatResponse.mockReturnValue(formattedResponse);

      // Act
      await controller.logout(req, res);

      // Assert: logoutUser should be called with undefined refreshToken.
      expect(authService.logoutUser).toHaveBeenCalledWith({
        refreshToken: undefined,
        userId: MOCK_USER_ID,
      });
      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(res.json).toHaveBeenCalledWith(formattedResponse);
    });
  });
});
