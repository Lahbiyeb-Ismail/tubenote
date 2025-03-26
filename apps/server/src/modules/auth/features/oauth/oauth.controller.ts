import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { envConfig } from "@/modules/shared/config";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IResponseFormatter } from "@/modules/shared/services";

import { refreshTokenCookieConfig } from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";
import httpStatus from "http-status";
import type { OAuthCodeDto } from "../../dtos";
import type { IOauthLoginDto } from "./dtos";
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

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);
  }

  private redirectWithTemporaryCode(res: Response, temporaryCode: string) {
    res.redirect(
      `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(temporaryCode)}`
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

    const user = req.user as IOauthLoginDto;

    const { refreshToken, temporaryCode } =
      await this._oauthService.handleOAuthLogin(user);

    this.setRefreshTokenCookie(res, refreshToken);

    this.redirectWithTemporaryCode(res, temporaryCode);
  }

  async exchangeOauthCodeForTokens(
    req: TypedRequest<OAuthCodeDto>,
    res: Response
  ): Promise<void> {
    const { code } = req.body;

    const { accessToken } =
      await this._oauthService.exchangeOauthCodeForTokens(code);

    const formattedResponse = this._responseFormatter.formatResponse({
      data: {
        accessToken,
        status: httpStatus.OK,
        message: "Access token exchanged successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
