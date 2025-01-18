import type { Response } from "express";
import httpStatus from "http-status";
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../../config/cookie.config";
import { REFRESH_TOKEN_NAME } from "../../../constants/auth.contants";
import { ERROR_MESSAGES } from "../../../constants/error-messages.contants";
import { UnauthorizedError } from "../../../errors";
import type { TypedRequest } from "../../../types";
import type {
  IRefreshTokenController,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenController implements IRefreshTokenController {
  constructor(private readonly _refreshTokenService: IRefreshTokenService) {}

  /**
   * Refreshes the access token using the refresh token.
   * @param req - The request object.
   * @param res - The response object.
   * @throws {UnauthorizedError} If the refresh token is not provided.
   */
  async refreshToken(req: TypedRequest, res: Response): Promise<void> {
    const cookies = req.cookies;
    const userId = req.userId;

    const token: string | null = cookies[REFRESH_TOKEN_NAME];

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    const { accessToken, refreshToken } =
      await this._refreshTokenService.refreshToken({
        token,
        userId,
      });

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      accessToken,
    });
  }
}
