import type { Response } from "express";
import { mock, mockReset } from "jest-mock-extended";

import type { TypedRequest } from "@/modules/shared/types";

import { refreshTokenCookieConfig } from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";
import { UnauthorizedError } from "@/modules/shared/api-errors";
import { envConfig } from "@/modules/shared/config";
import { OAuthController } from "../oauth.controller";

import type {
  IAuthResponseDto,
  OAuthCodeDto,
  OAuthResponseDto,
} from "@/modules/auth/dtos";
import type { IResponseFormatter } from "@/modules/shared/services";
import type { IOauthLoginDto } from "../dtos";
import type { IOAuthControllerOptions, IOAuthService } from "../oauth.types";

describe("OAuthController", () => {
  let controller: OAuthController;
  const oauthService = mock<IOAuthService>();
  const responseFormatter = mock<IResponseFormatter>();

  const oauthLoginreq = mock<TypedRequest>();
  const oauthCodeReq = mock<TypedRequest<OAuthCodeDto>>();

  const res = mock<Response>();

  const controllerOptions: IOAuthControllerOptions = {
    oauthService,
    responseFormatter,
  };

  const authResponse: IAuthResponseDto = {
    accessToken: "test-access-token",
    refreshToken: "test-refresh-token",
  };

  const oauthResponse: OAuthResponseDto = {
    ...authResponse,
    temporaryCode: "test-temp-code",
  };

  beforeEach(() => {
    mockReset(oauthService);
    mockReset(responseFormatter);

    // Create fresh mocks for the oauthService methods.
    oauthService.handleOAuthLogin.mockResolvedValue(oauthResponse);

    oauthService.exchangeOauthCodeForTokens.mockResolvedValue(authResponse);

    // Reset the singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    OAuthController._instance = undefined;

    // Create an instance of the OAuthController.
    controller = OAuthController.getInstance(controllerOptions);

    // Create a mocked response object with chainable methods.
    res.cookie.mockReturnThis();
    res.redirect.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("Singleton Behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = OAuthController.getInstance(controllerOptions);
      expect(instance).toBeInstanceOf(OAuthController);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = OAuthController.getInstance(controllerOptions);
      const instance2 = OAuthController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("oauthLogin", () => {
    const oauthLoginDto: IOauthLoginDto = {
      createAccountDto: {
        data: {
          provider: "google",
          providerAccountId: "provider-id",
          type: "oauth",
        },
      },
      createUserDto: {
        data: {
          email: "user@example.com",
          password: "userPassword12!",
          username: "test user",
          isEmailVerified: true,
          profilePicture: "profile_picture.png",
        },
      },
    };

    it("should throw UnauthorizedError if req.user is missing", async () => {
      // Arrange: no user attached to the request.
      oauthLoginreq.user = undefined;
      // Act & Assert: expecting an UnauthorizedError.
      await expect(controller.oauthLogin(oauthLoginreq, res)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should handle OAuth login successfully by setting refresh token cookie and redirecting with temporary code", async () => {
      // Arrange: simulate a valid authenticated request.
      oauthLoginreq.user = oauthLoginDto;

      // Act
      await controller.oauthLogin(oauthLoginreq, res);

      // Assert: verify that handleOAuthLogin is called with oauthLoginreq.user.
      expect(oauthService.handleOAuthLogin).toHaveBeenCalledWith(
        oauthLoginreq.user
      );
      // Verify that the refresh token cookie is set.
      expect(res.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        "test-refresh-token",
        refreshTokenCookieConfig
      );
      // Verify that the user is redirected with a temporary code.
      const expectedRedirectUrl = `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(
        "test-temp-code"
      )}`;
      expect(res.redirect).toHaveBeenCalledWith(expectedRedirectUrl);
    });
  });

  describe("exchangeOauthCodeForTokens", () => {
    // const formattedResponse: ApiResponse<{ accessToken: string }> = {
    //   success: true,
    //   status: httpStatus.OK,
    //   message: "Access token exchanged successfully.",
    //   data: {
    //     accessToken: "test-access-token",
    //   },
    // };

    // it("should exchange a valid OAuth code for tokens and return an access token", async () => {
    //   // Arrange: simulate a request with a valid OAuth code.
    //   oauthCodeReq.body = {
    //     code: "valid-oauth-code",
    //   };

    //   responseFormatter.formatResponse.mockReturnValue(formattedResponse);

    //   // Act
    //   await controller.exchangeOauthCodeForTokens(oauthCodeReq, res);
    //   // Assert: verify that exchangeOauthCodeForTokens is called with the provided code.
    //   expect(oauthService.exchangeOauthCodeForTokens).toHaveBeenCalledWith(
    //     "valid-oauth-code"
    //   );
    //   // Verify that a success JSON response is sent with the access token.
    //   expect(res.json).toHaveBeenCalledWith(formattedResponse);
    // });

    it("should propagate errors if exchangeOauthCodeForTokens fails", async () => {
      // Arrange: simulate a failing scenario.
      oauthCodeReq.body = {
        code: "invalid-oauth-code",
      };

      const error = new Error("Exchange failed");
      oauthService.exchangeOauthCodeForTokens.mockRejectedValueOnce(error);

      // Act & Assert: expecting the error to be thrown.
      await expect(
        controller.exchangeOauthCodeForTokens(oauthCodeReq, res)
      ).rejects.toThrow(error);
    });
  });
});
