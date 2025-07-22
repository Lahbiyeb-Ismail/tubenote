import type { Response } from "express";

import { ERROR_MESSAGES, UnauthorizedError } from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import { TYPES } from "@/config/inversify/types";

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
    private readonly _responseFormatter: IResponseFormatter,
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
    const authHeader = req.headers.authorization;
    const clientContext = req.clientContext;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const deviceId = [
      req.headers["user-agent"],
      req.headers["accept-language"],
      req.headers["sec-ch-ua-platform"],
    ].join("|");

    const ipAddress = req.clientIp as string;

    const userRefreshToken = authHeader.split(" ")[1];

    if (!userRefreshToken || typeof userRefreshToken !== "string") {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const authTokens
      = await this._refreshTokenService.refreshTokens(
        userRefreshToken,
        deviceId,
        ipAddress,
        clientContext,
      );

    const formattedRes = this._responseFormatter.formatSuccessResponse({
      responseOptions: {
        message: "Tokens refreshed successfully",
        data: authTokens,
      },
    });

    res.status(formattedRes.statusCode).json(formattedRes);
  }
}
