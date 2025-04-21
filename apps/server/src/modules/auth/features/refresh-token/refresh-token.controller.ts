import type { Response } from "express";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { TypedRequest } from "@/modules/shared/types";

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import type { IResponseFormatter } from "@/modules/shared/services";

import type {
  IRefreshTokenController,
  IRefreshTokenControllerOptions,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenController implements IRefreshTokenController {
  private static _instance: RefreshTokenController;

  private constructor(
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  public static getInstance(
    options: IRefreshTokenControllerOptions
  ): RefreshTokenController {
    if (!this._instance) {
      this._instance = new RefreshTokenController(
        options.refreshTokenService,
        options.responseFormatter
      );
    }

    return this._instance;
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @param req - The request object.
   * @param res - The response object.
   *
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
      await this._refreshTokenService.refreshToken(userId, token);

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<string>({
        responseOptions: {
          data: accessToken,
          message: "Access token refreshed successfully.",
        },
      });

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
