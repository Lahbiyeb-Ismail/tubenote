import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { envConfig } from "@/modules/shared/config";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { refreshTokenCookieConfig } from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";
import type { OAuthCodeDto } from "../../dtos";
import type { IOauthLoginDto } from "./dtos";
import type {
  IOAuthController,
  IOAuthControllerOptions,
  IOAuthService,
} from "./oauth.types";

export class OAuthController implements IOAuthController {
  private static instance: OAuthController;
  private readonly _oauthService: IOAuthService;

  constructor(options: IOAuthControllerOptions) {
    this._oauthService = options.oauthService;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);
  }

  private redirectWithTemporaryCode(res: Response, temporaryCode: string) {
    res.redirect(
      `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(temporaryCode)}`
    );
  }

  static getInstance(options: IOAuthControllerOptions): OAuthController {
    if (!OAuthController.instance) {
      this.instance = new OAuthController(options);
    }

    return OAuthController.instance;
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

    const tokens = await this._oauthService.exchangeOauthCodeForTokens(code);

    res.json({
      message: "Access token exchanged successfully",
      accessToken: tokens.accessToken,
    });
  }
}
