import type { Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "@/config/inversify/types";
import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { TypedRequest } from "@/modules/shared/types";

import {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/modules/auth/constants";

import type { IResponseFormatter } from "@/modules/shared/services";

import type {
  IRefreshTokenController,
  IRefreshTokenService,
} from "./refresh-token.types";

@injectable()
export class RefreshTokenController implements IRefreshTokenController {
  constructor(
    @inject(TYPES.RefreshTokenService)
    private readonly _refreshTokenService: IRefreshTokenService,
    @inject(TYPES.ResponseFormatter)
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  /**
   * Refreshes the access token using the refresh token.
   *
   * @param req - The request object.
   * @param res - The response object.
   *
   * @throws {UnauthorizedError} If the refresh token is not provided.
   */
  async refreshAuthTokens(req: TypedRequest, res: Response): Promise<void> {
    const cookies = req.cookies;
    const clientContext = req.clientContext;

    const deviceId = [
      req.headers["user-agent"],
      req.headers["accept-language"],
      req.headers["sec-ch-ua-platform"],
    ].join("|");

    const ipAddress = req.clientIp as string;

    const userRefreshToken = cookies[REFRESH_TOKEN_NAME];

    if (!userRefreshToken || typeof userRefreshToken !== "string") {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } =
      await this._refreshTokenService.refreshTokens(
        userRefreshToken,
        deviceId,
        ipAddress,
        clientContext
      );

    res.cookie(ACCESS_TOKEN_NAME, accessToken, accessTokenCookieConfig);
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);
  }
}
