import { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import { REFRESH_TOKEN_NAME } from "@/modules/auth";

import { AuthController, IAuthService } from "@/modules/auth";
import { UnauthorizedError } from "@/modules/shared/api-errors";
import { mock, mockReset } from "jest-mock-extended";

describe("AuthController", () => {
  const mockAuthService = mock<IAuthService>();

  const authController = AuthController.getInstance({
    authService: mockAuthService,
  });

  const req = mock<TypedRequest>();

  const res = mock<Response>();

  const MOCK_USER_ID = "user-id-123";
  const MOCK_REFRESH_TOKEN_VALUE = "refresh-token-123";

  beforeEach(() => {
    mockReset(mockAuthService);

    req.cookies = {
      [REFRESH_TOKEN_NAME]: MOCK_REFRESH_TOKEN_VALUE,
    };

    req.userId = MOCK_USER_ID;
  });

  describe("AuthController - logout", () => {
    it("should throw UnauthorizedError if refreshToken is missing", async () => {
      req.cookies = {};
      await expect(authController.logout(req, res)).rejects.toThrow(
        UnauthorizedError
      );
      expect(mockAuthService.logoutUser).not.toHaveBeenCalled();
      expect(res.clearCookie).not.toHaveBeenCalled();
    });

    // it("should call authService.logoutUser with correct parameters and clear cookie", async () => {
    //   await authController.logout(req, res);
    //   expect(mockAuthService.logoutUser).toHaveBeenCalledWith({
    //     refreshToken: MOCK_REFRESH_TOKEN_VALUE,
    //     userId: MOCK_USER_ID,
    //   });

    //   expect(res.clearCookie).toHaveBeenCalledWith(
    //     REFRESH_TOKEN_NAME,
    //     clearRefreshTokenCookieConfig
    //   );

    //   expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
    // });

    // it("should propagate errors from authService.logoutUser", async () => {
    //   const serviceError = new Error("Service failure");
    //   mockAuthService.logoutUser.mockRejectedValue(serviceError);

    //   await expect(authController.logout(req, res)).rejects.toThrow(
    //     serviceError
    //   );
    //   expect(res.clearCookie).toHaveBeenCalled();
    // });

    // it("should clear cookie with correct configuration", async () => {
    //   await authController.logout(req, res);
    //   expect(res.clearCookie).toHaveBeenCalledWith(
    //     REFRESH_TOKEN_NAME,
    //     expect.objectContaining(clearRefreshTokenCookieConfig)
    //   );
    // });
  });

  // describe("AuthController - exchangeOauthCodeForTokens", () => {
  //   let mockRequest: Partial<TypedRequest<OAuthCodeDto>>;

  //   const mockCode = "valid-code-123";

  //   const mockAuthResponse: IAuthResponseDto = {
  //     accessToken: "access-token-123",
  //     refreshToken: "refresh-token-123",
  //   };

  //   beforeEach(() => {
  //     mockRequest = {
  //       body: { code: mockCode },
  //     };
  //   });

  //   it("should successfully exchange code for tokens", async () => {
  //     mockAuthService.exchangeOauthCodeForTokens.mockResolvedValue(
  //       mockAuthResponse
  //     );

  //     await authController.exchangeOauthCodeForTokens(
  //       req<OAuthCodeDto>,
  //       res
  //     );

  //     expect(mockAuthService.exchangeOauthCodeForTokens).toHaveBeenCalledWith(
  //       mockCode
  //     );
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "Access token exchanged successfully",
  //       accessToken: mockAuthResponse.accessToken,
  //     });
  //   });

  //   it("should handle service errors", async () => {
  //     const error = new Error("Token exchange failed");

  //     mockAuthService.exchangeOauthCodeForTokens.mockRejectedValue(error);

  //     await expect(
  //       authController.exchangeOauthCodeForTokens(
  //         req<OAuthCodeDto>,
  //         res
  //       )
  //     ).rejects.toThrow(error);

  //     expect(res.json).not.toHaveBeenCalled();
  //   });

  //   it("should handle response errors", async () => {
  //     mockAuthService.exchangeOauthCodeForTokens.mockResolvedValue(
  //       mockAuthResponse
  //     );

  //     res.json = jest.fn().mockImplementation(() => {
  //       throw new Error("Response error");
  //     });

  //     await expect(
  //       authController.exchangeOauthCodeForTokens(
  //         req<OAuthCodeDto>,
  //         res
  //       )
  //     ).rejects.toThrow("Response error");
  //   });
  // });
});
