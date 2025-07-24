import type { IApiSuccessResponse } from "@tubenote/types";
import type { Response } from "express";

import { UnauthorizedError } from "@tubenote/api-errors";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { ACCESS_TOKEN_NAME, clearAuthTokenCookieConfig, IAuthService, REFRESH_TOKEN_NAME } from "@/modules/auth";
import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import type { AuthController } from "../auth.controller";

describe("authController", () => {
  let controller: AuthController;
  const authService = mock<IAuthService>();
  const responseFormatter = mock<IResponseFormatter>();

  const req = mock<TypedRequest>();
  const res = mock<Response>();

  const MOCK_USER_ID = "user-id-123";
  const MOCK_REFRESH_TOKEN_VALUE = "refresh-token-123";

  beforeEach(() => {
    mockReset(authService);
    mockReset(responseFormatter);

    // Create a fresh mock for authService.logoutUser.
    authService.logoutUser.mockResolvedValue(undefined);

    // Initialize the controller instance.

    req.cookies = {
      [REFRESH_TOKEN_NAME]: MOCK_REFRESH_TOKEN_VALUE,
    };

    req.userId = MOCK_USER_ID;

    res.clearCookie.mockReturnThis();
    res.sendStatus.mockReturnThis();
    res.json.mockReturnThis();
    res.status.mockReturnThis();
    res.header.mockReturnThis();
  });

  describe("logout", () => {
    const formattedResponse: IApiSuccessResponse<null> = {
      success: true,
      statusCode: httpStatus.OK,
      payload: {
        message: "User logged out successfully.",
        data: null,
      },
    };

    it("should call logoutUser with correct parameters, clear the refresh token cookie, and send OK status", async () => {
      // Arrange: mock the response formatter to return the expected response.
      responseFormatter.formatSuccessResponse.mockReturnValue(
        formattedResponse,
      );

      // Act
      await controller.logout(req, res);

      // Assert
      expect(authService.logoutUser).toHaveBeenCalledWith({
        refreshToken: MOCK_REFRESH_TOKEN_VALUE,
        userId: MOCK_USER_ID,
      });

      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );

      expect(res.clearCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );

      expect(res.json).toHaveBeenCalledWith(formattedResponse);
    });

    it("should propagate errors if logoutUser fails", async () => {
      // Arrange: simulate an error in logoutUser.
      const error = new Error("Logout failed");
      authService.logoutUser.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.logout(req, res)).rejects.toThrow(
        "Logout failed",
      );

      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );

      expect(res.clearCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );
    });

    it("should throw an UnauthorizedError if cookie is missing", async () => {
      // Arrange: remove the refresh token from cookies.
      req.cookies = {};

      // Act & Assert
      await expect(controller.logout(req, res)).rejects.toThrow(
        UnauthorizedError,
      );

      // Assert: logoutUser should not be called.
      expect(authService.logoutUser).not.toHaveBeenCalled();
      expect(responseFormatter.formatSuccessResponse).not.toHaveBeenCalled();

      expect(res.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );

      expect(res.clearCookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_NAME,
        clearAuthTokenCookieConfig,
      );
    });
  });
});
