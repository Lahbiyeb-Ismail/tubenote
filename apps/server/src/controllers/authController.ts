import type { Response } from "express";
import httpStatus from "http-status";
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../config/cookie.config";
import { REFRESH_TOKEN_NAME } from "../constants/auth";
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
}

export default new AuthController();
