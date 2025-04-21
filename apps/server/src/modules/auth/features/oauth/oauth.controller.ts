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
