import type { Response } from "express";
import httpStatus from "http-status";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import type {
  IAuthController,
  IAuthControllerOptions,
  IAuthService,
} from "./auth.types";

import { clearRefreshTokenCookieConfig } from "./config";
import { REFRESH_TOKEN_NAME } from "./constants";

/**
 * Controller for handling authentication-related operations.
 */
export class AuthController implements IAuthController {
  private static _instance: AuthController;

  private constructor(
    private readonly _authService: IAuthService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  /**
   * Retrieves the singleton instance of the `AuthController` class.
   * If the instance does not already exist, it creates a new one using the provided options.
   *
   * @param options - Configuration options for initializing the `AuthController` instance.
   * @returns The singleton instance of the `AuthController`.
   */
  public static getInstance(options: IAuthControllerOptions): AuthController {
    if (!this._instance) {
      this._instance = new AuthController(
        options.authService,
        options.responseFormatter
      );
    }

    return this._instance;
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

    await this._authService.logoutUser({ refreshToken, userId });

    const formattedResponse = this._responseFormatter.formatResponse({
      status: httpStatus.NO_CONTENT,
      message: "User logged out successfully.",
    });

    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

    res.status(httpStatus.NO_CONTENT).json(formattedResponse);
  }
}
