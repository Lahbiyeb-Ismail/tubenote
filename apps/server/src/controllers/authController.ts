import type { Response } from "express";
import httpStatus from "http-status";
import type { Profile } from "passport-google-oauth20";
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../config/cookie.config";
import envConfig from "../config/envConfig";
import { REFRESH_TOKEN_NAME } from "../constants/auth";
import { UnauthorizedError } from "../errors";
import authService from "../services/authService";
import type { TypedRequest } from "../types";
import type { LoginCredentials, RegisterCredentials } from "../types/auth.type";

class AuthController {
  async register(req: TypedRequest<RegisterCredentials>, res: Response) {
    const { username, email, password } = req.body;

    const user = await authService.registerUser({ username, email, password });

    res.status(httpStatus.CREATED).json({
      message: "A verification email has been sent to your email.",
      email: user.email,
    });
  }

  async login(req: TypedRequest<LoginCredentials>, res: Response) {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      message: "Login successful",
      accessToken,
    });
  }

  async logout(req: TypedRequest, res: Response) {
    const cookies = req.cookies;

    const refreshToken = cookies[REFRESH_TOKEN_NAME];

    await authService.logoutUser(refreshToken);

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    res.sendStatus(httpStatus.NO_CONTENT);
  }

  async refresh(req: TypedRequest, res: Response) {
    const cookies = req.cookies;

    const token = cookies[REFRESH_TOKEN_NAME];

    if (!token) {
      throw new UnauthorizedError("Unauthorized access. Please try again.");
    }

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    const { accessToken, refreshToken } = await authService.refreshToken(token);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      accessToken,
    });
  }

  async loginWithGoogle(req: TypedRequest, res: Response) {
    const user = req.user as Profile;

    const { accessToken, refreshToken } = await authService.googleLogin(user);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.redirect(
      `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
    );
  }
}

export default new AuthController();
