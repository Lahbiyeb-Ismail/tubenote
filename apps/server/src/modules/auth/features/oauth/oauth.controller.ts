import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { envConfig } from "@/modules/shared/config";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IResponseFormatter } from "@/modules/shared/services";

import {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/modules/auth/constants";

import type { IOAuthAuthorizationCodeDto, IOauthLoginDto } from "./dtos";
import type {
  IOAuthController,
  IOAuthControllerOptions,
  IOAuthService,
} from "./oauth.types";

export class OAuthController implements IOAuthController {
  private static _instance: OAuthController;

  private constructor(
    private readonly _oauthService: IOAuthService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  /**
   * Redirects the user to the client application with a temporary code.
   *
   * @param res - The response object.
   * @param temporaryCode - The temporary code to be sent to the client application.
   */
  private redirectWithTemporaryCode(res: Response, temporaryCode: string) {
    res.redirect(
      `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(
        temporaryCode
      )}`
    );
  }

  public static getInstance(options: IOAuthControllerOptions): OAuthController {
    if (!this._instance) {
      this._instance = new OAuthController(
        options.oauthService,
        options.responseFormatter
      );
    }

    return this._instance;
  }

  /**
   * Handles the OAuth login process.
   *
   * This method validates the presence of a user in the request object and processes
   * the OAuth login by creating or updating user and account information. It generates
   * a refresh token and a temporary code, sets the refresh token as a cookie, and redirects
   * the client with the temporary code.
   *
   * @param req - The incoming request object, expected to contain user information.
   * @param res - The response object used to send cookies and perform redirection.
   *
   * @throws {UnauthorizedError} If the user is not present in the request object.
   */
  async oauthLogin(req: TypedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { createAccountDto, createUserDto } = req.user as IOauthLoginDto;

    const { refreshToken, temporaryCode } =
      await this._oauthService.handleOAuthLogin(
        createUserDto,
        createAccountDto
      );

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    this.redirectWithTemporaryCode(res, temporaryCode);
  }

  /**
   * Handles the exchange of an OAuth authorization code for access tokens.
   *
   * @param req - The HTTP request object containing the OAuth authorization code in the body.
   * @param res - The HTTP response object used to send the response back to the client.
   * @returns A promise that resolves to void.
   *
   * This method performs the following steps:
   * 1. Extracts the authorization code from the request body.
   * 2. Calls the OAuth service to exchange the authorization code for an access token.
   * 3. Formats a success response with the access token.
   * 4. Sets the access token as a cookie in the response.
   * 5. Sends the formatted response back to the client with the appropriate status code.
   *
   * @throws Will throw an error if the OAuth service fails to exchange the code for tokens.
   */
  async exchangeOauthCodeForTokens(
    req: TypedRequest<IOAuthAuthorizationCodeDto>,
    res: Response
  ): Promise<void> {
    const { code } = req.body;

    const { accessToken } =
      await this._oauthService.exchangeOauthCodeForTokens(code);

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<string>({
        responseOptions: {
          message: "Access token exchanged successfully.",
          data: accessToken,
        },
      });

    res.cookie(ACCESS_TOKEN_NAME, accessToken, accessTokenCookieConfig);

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
