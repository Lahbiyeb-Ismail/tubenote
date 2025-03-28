import type { Response } from "express";
import httpStatus from "http-status";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import type { IUpdatePasswordBodyDto } from "./dtos";
import type { User } from "./user.model";
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
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  public static getInstance(options: IUserControllerOptions): UserController {
    if (!this._instance) {
      this._instance = new UserController(
        options.userService,
        options.responseFormatter
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

    const user = await this._userService.getUserByIdOrEmail({ id: userId });

    const formatedResponse = this._responseFormatter.formatResponse<User>({
      responseOptions: {
        data: user,
        status: httpStatus.OK,
        message: "User retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formatedResponse);
  }

  /**
   * Update the current user's information.
   *
   * @param req - The request object containing the user ID and updated user data.
   * @param res - The response object to confirm the update.
   */
  async updateCurrentUser(
    req: TypedRequest<IUpdateBodyDto<User>>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.updateUser({
      id: userId,
      data: req.body,
    });

    const formatedResponse = this._responseFormatter.formatResponse<User>({
      responseOptions: {
        data: user,
        status: httpStatus.OK,
        message: "User updated successfully.",
      },
    });

    res.status(httpStatus.OK).json(formatedResponse);
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
  async updatePassword(
    req: TypedRequest<IUpdatePasswordBodyDto>,
    res: Response
  ) {
    const userId = req.userId;

    const user = await this._userService.updateUserPassword({
      id: userId,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    const formatedResponse = this._responseFormatter.formatResponse<User>({
      responseOptions: {
        data: user,
        status: httpStatus.OK,
        message: "User password updated successfully.",
      },
    });

    res.status(httpStatus.OK).json(formatedResponse);
  }
}
