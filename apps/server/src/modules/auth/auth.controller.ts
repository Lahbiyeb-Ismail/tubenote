import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/modules/shared/types";
import type { IAuthController, IAuthService } from "./auth.types";

import { clearRefreshTokenCookieConfig } from "./config";
import { REFRESH_TOKEN_NAME } from "./constants";

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
}
