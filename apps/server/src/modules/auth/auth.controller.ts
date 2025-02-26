import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";

import { clearRefreshTokenCookieConfig } from "@modules/auth";
import { REFRESH_TOKEN_NAME } from "@modules/auth";

import type {
  IAuthController,
  IAuthService,
  OAuthCodeDto,
} from "@modules/auth";

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

  async exchangeOauthCodeForTokens(
    req: TypedRequest<OAuthCodeDto>,
    res: Response
  ): Promise<void> {
    const { code } = req.body;

    const tokens = await this._authService.exchangeOauthCodeForTokens(code);

    res.json({
      message: "Access token exchanged successfully",
      accessToken: tokens.accessToken,
    });
  }
}
