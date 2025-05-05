import type { Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "@/config/inversify/types";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import type { IAuthController, IAuthService } from "./auth.types";

import { UnauthorizedError } from "../shared/api-errors";
import { ERROR_MESSAGES } from "../shared/constants";
import { clearAuthTokenCookieConfig } from "./config";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "./constants";

/**
 * Controller for handling authentication-related operations.
 */
@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
    @inject(TYPES.ResponseFormatter)
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  /**
   * Logs out a user by invalidating their refresh token and clearing auth cookies.
   *
   * @param req - The request object containing cookies and user ID
   * @param res - The response object for clearing cookies and sending response
   * @returns Promise resolving when the logout operation is complete
   *
   * @throws {UnauthorizedError} If the user is not authenticated
   * @throws {InternalServerError} If logout fails unexpectedly
   */
  async logout(req: TypedRequest, res: Response): Promise<void> {
    try {
      const { cookies, userId } = req;
      const refreshToken = cookies[REFRESH_TOKEN_NAME];

      // Validate that the user is authenticated
      if (!userId || !refreshToken) {
        throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
      }

      await this._authService.logoutUser({ refreshToken, userId });

      // Format and send the response
      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<null>({
          responseOptions: {
            message: "User logged out successfully",
            data: null,
          },
        });

      // Clear authentication cookies
      this.clearAuthCookies(res);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error) {
      // Always clear cookies on logout, even if there's an error
      this.clearAuthCookies(res);

      // Let the global error handler take care of the response
      throw error;
    }
  }

  /**
   * Clears authentication cookies from the response.
   *
   * @param res - The response object
   */
  private clearAuthCookies(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_NAME, clearAuthTokenCookieConfig);
    res.clearCookie(ACCESS_TOKEN_NAME, clearAuthTokenCookieConfig);
  }
}
