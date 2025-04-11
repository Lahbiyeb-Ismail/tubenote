import type { Response } from "express";

import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { User } from "@tubenote/types";

import { NotFoundError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import { USER_RATE_LIMIT_CONFIG } from "./config";

import type {
  IUserController,
  IUserControllerOptions,
  IUserService,
} from "./user.types";

/**
 * Controller for handling user-related operations.
 */
export class UserController implements IUserController {
  private static _instance: UserController;

  private constructor(
    private readonly _userService: IUserService,
    private readonly _responseFormatter: IResponseFormatter,
    private readonly _rateLimitService: IRateLimitService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(options: IUserControllerOptions): UserController {
    if (!this._instance) {
      this._instance = new UserController(
        options.userService,
        options.responseFormatter,
        options.rateLimitService,
        options.loggerService
      );
    }
    return this._instance;
  }

  /**
   * Get the current user's information.
   *
   * @param req - The request object containing the user ID.
   * @param res - The response object to send the user data.
   */
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<User>({
        responseOptions: {
          data: user,
          message: "User retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Update the current user's information.
   *
   * @param req - The request object containing the user ID and updated user data.
   * @param res - The response object to confirm the update.
   */
  async updateCurrentUser(
    req: TypedRequest<IUpdateUserDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.updateUser(userId, {
      ...req.body,
    });

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<User>({
        responseOptions: {
          data: user,
          message: "User updated successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Updates the password of the authenticated user.
   *
   * @param req - The request object containing the user ID and the password update details.
   * @param res - The response object used to send the status and result back to the client.
   *
   * @returns A promise that resolves to a response indicating the success of the password update.
   *
   * @remarks
   * This method expects the request body to contain the current password and the new password.
   * It uses the user ID from the request to identify the user whose password is to be updated.
   * The response will include a success message and the updated user details.
   */
  async updatePassword(req: TypedRequest<IUpdatePasswordDto>, res: Response) {
    try {
      const userId = req.userId;

      const user = await this._userService.updateUserPassword(userId, {
        ...req.body,
      });

      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<User>({
          responseOptions: {
            data: user,
            message: "User password updated successfully.",
          },
        });

      await this._rateLimitService.reset(req.rateLimitKey);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error: any) {
      await this._rateLimitService.increment({
        key: req.rateLimitKey,
        ...USER_RATE_LIMIT_CONFIG.updatePassword,
      });

      this._loggerService.error("Error updating password", error);

      throw error;
    }
  }
}
