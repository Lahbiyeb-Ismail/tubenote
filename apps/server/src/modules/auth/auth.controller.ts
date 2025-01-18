import type { Response } from "express";
import httpStatus from "http-status";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../config/cookie.config";
import envConfig from "../../config/env.config";

import { REFRESH_TOKEN_NAME } from "../../constants/auth.contants";
import { ERROR_MESSAGES } from "../../constants/error-messages.contants";

import { UnauthorizedError } from "../../errors";

import type { IAuthController, IAuthService } from "./auth.types";

import type { TypedRequest } from "../../types";
import type { User } from "../user/user.model";

import type { LoginUserDto } from "./dtos/login-user.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";

/**
 * Controller for handling authentication-related operations.
 */
export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) {}

  /**
   * Logs out a user.
   * @param req - The request object.
   * @param res - The response object.
   */
  async logout(req: TypedRequest, res: Response) {
    const cookies = req.cookies;
    const userId = req.userId;

    const refreshToken = cookies[REFRESH_TOKEN_NAME];

    await this._authService.logoutUser({ refreshToken, userId });

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    res.sendStatus(httpStatus.NO_CONTENT);
  }

  /**
   * Logs in a user using Google authentication.
   * @param req - The request object containing the Google user profile.
   * @param res - The response object.
   */
  async loginWithGoogle(req: TypedRequest, res: Response) {
    const user = req.user as User;

    const { accessToken, refreshToken } =
      await this._authService.googleLogin(user);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.redirect(
      `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
    );
  }
}
