import type { Response } from "express";

import { ERROR_MESSAGES, UnauthorizedError } from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import { TYPES } from "@/config/inversify/types";

import type { IAuthController, IAuthService } from "./auth.types";

/**
 * Controller for handling authentication-related operations.
 */
@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
    @inject(TYPES.ResponseFormatter)
    private readonly _responseFormatter: IResponseFormatter,
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
    const userId = req.userId;
    const refreshToken = req.body.refreshToken as string;

    // Validate that the user is authenticated
    if (!userId || !refreshToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._authService.logoutUser({ refreshToken, userId });

    // Format and send the response
    const formattedResponse
        = this._responseFormatter.formatSuccessResponse<null>({
          responseOptions: {
            message: "User logged out successfully",
            data: null,
          },
        });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
