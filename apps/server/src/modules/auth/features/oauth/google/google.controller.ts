import type { Response } from "express";

import type { TypedRequest } from "@/types";

import { UnauthorizedError } from "@modules/shared";

import { refreshTokenCookieConfig } from "@config/cookie.config";
import envConfig from "@config/env.config";

import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { REFRESH_TOKEN_NAME } from "@modules/auth";

import type { User } from "@modules/user";

import { IGoogleAuthController, IGoogleAuthService } from "./google.types";

export class GoogleController implements IGoogleAuthController {
  constructor(private readonly _googleAuthService: IGoogleAuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);
  }

  private redirectWithTemporaryCode(res: Response, temporaryCode: string) {
    res.redirect(
      `${envConfig.client.url}/auth/callback?code=${encodeURIComponent(temporaryCode)}`
    );
  }

  /**
   * Logs in a user using Google authentication.
   * @param req - The request object containing the Google user profile.
   * @param res - The response object.
   */
  async googleLogin(req: TypedRequest, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const user = req.user as User;

    const { refreshToken, temporaryCode } =
      await this._googleAuthService.googleLogin(user);

    this.setRefreshTokenCookie(res, refreshToken);

    this.redirectWithTemporaryCode(res, temporaryCode);
  }
}
