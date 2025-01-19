import type { Response } from "express";

import { refreshTokenCookieConfig } from "@config/cookie.config";
import envConfig from "@config/env.config";
import { REFRESH_TOKEN_NAME } from "@constants/auth.contants";

import type { TypedRequest } from "@/types";

import type { User } from "@modules/user/user.model";
import type {
  IGoogleAuthController,
  IGoogleAuthService,
} from "./google-auth.types";

export class GoogleController implements IGoogleAuthController {
  constructor(private readonly _googleAuthService: IGoogleAuthService) {}

  /**
   * Logs in a user using Google authentication.
   * @param req - The request object containing the Google user profile.
   * @param res - The response object.
   */
  async googleLogin(req: TypedRequest, res: Response) {
    const user = req.user as User;

    const { accessToken, refreshToken } =
      await this._googleAuthService.googleLogin(user);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.redirect(
      `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
    );
  }
}
