import type { Response } from "express";
import httpStatus from "http-status";
import type { Profile } from "passport-google-oauth20";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../config/cookie.config";
import envConfig from "../../config/envConfig";

import { REFRESH_TOKEN_NAME } from "../../constants/auth";

import { UnauthorizedError } from "../../errors";

import AuthService from "./auth.service";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import type { TypedRequest } from "../../types";
import type { GoogleUser } from "./auth.type";
import type { LoginUserDto } from "./dtos/login-user.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";

/**
 * Controller for handling authentication-related operations.
 */
class AuthController {
  /**
   * Registers a new user.
   * @param req - The request object containing user registration credentials.
   * @param res - The response object.
   */
  async register(req: TypedRequest<RegisterUserDto>, res: Response) {
    const user = await AuthService.registerUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "A verification email has been sent to your email.",
      email: user.email,
    });
  }

  /**
   * Logs in a user.
   * @param req - The request object containing user login credentials.
   * @param res - The response object.
   */
  async login(req: TypedRequest<LoginUserDto>, res: Response) {
    const { accessToken, refreshToken } = await AuthService.loginUser(req.body);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      message: "Login successful",
      accessToken,
    });
  }

  /**
   * Logs out a user.
   * @param req - The request object.
   * @param res - The response object.
   */
  async logout(req: TypedRequest, res: Response) {
    const cookies = req.cookies;
    const userId = req.userId;

    const refreshToken = cookies[REFRESH_TOKEN_NAME];

    await AuthService.logoutUser({ refreshToken, userId });

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    res.sendStatus(httpStatus.NO_CONTENT);
  }

  /**
   * Refreshes the access token using the refresh token.
   * @param req - The request object.
   * @param res - The response object.
   * @throws {UnauthorizedError} If the refresh token is not provided.
   */
  async refresh(req: TypedRequest, res: Response) {
    const cookies = req.cookies;
    const userId = req.userId;

    const token: string | null = cookies[REFRESH_TOKEN_NAME];

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    const { accessToken, refreshToken } = await AuthService.refreshToken({
      token,
      userId,
    });

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      accessToken,
    });
  }

  /**
   * Logs in a user using Google authentication.
   * @param req - The request object containing the Google user profile.
   * @param res - The response object.
   */
  async loginWithGoogle(req: TypedRequest, res: Response) {
    const user = req.user as Profile;

    const googleUser = user._json as GoogleUser;

    const { accessToken, refreshToken } =
      await AuthService.googleLogin(googleUser);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.redirect(
      `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
    );
  }
}

export default new AuthController();
