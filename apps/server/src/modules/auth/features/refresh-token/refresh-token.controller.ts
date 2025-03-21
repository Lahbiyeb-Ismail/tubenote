import type { Response } from "express";
import httpStatus from "http-status";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { TypedRequest } from "@/modules/shared/types";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import type {
  IRefreshTokenController,
  IRefreshTokenControllerOptions,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenController implements IRefreshTokenController {
  private static instance: RefreshTokenController;

  constructor(private readonly _refreshTokenService: IRefreshTokenService) {}

  static getInstance(
    options: IRefreshTokenControllerOptions
  ): RefreshTokenController {
    if (!RefreshTokenController.instance) {
      RefreshTokenController.instance = new RefreshTokenController(
        options.refreshTokenService
      );
    }

    return RefreshTokenController.instance;
  }

  /**
   * Refreshes the access token using the refresh token.
   * @param req - The request object.
   * @param res - The response object.
   * @throws {UnauthorizedError} If the refresh token is not provided.
   */
  async refreshToken(req: TypedRequest, res: Response): Promise<void> {
    const cookies = req.cookies;
    const userId = req.userId;

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    const token = cookies[REFRESH_TOKEN_NAME];

    if (!token || typeof token !== "string") {
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
