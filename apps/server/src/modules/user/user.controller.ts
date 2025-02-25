import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";

import type {
  IUpdatePasswordBodyDto,
  IUserController,
  IUserService,
  User,
} from "@modules/user";

import type { IUpdateBodyDto } from "@modules/shared";

/**
 * Controller for handling user-related operations.
 */
export class UserController implements IUserController {
  constructor(private readonly _userService: IUserService) {}

  /**
   * Maps a User object to a response object, omitting the password field.
   *
   * @param user - The User object to be mapped.
   * @returns An object containing all properties of the User except the password.
   */
  private _mapUserToResponse(user: User): Omit<User, "password"> {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      videoIds: user.videoIds,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get the current user's information.
   *
   * @param req - The request object containing the user ID.
   * @param res - The response object to send the user data.
   */
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.getUser({ id: userId });

    res.status(httpStatus.OK).json({
      message: "User retrieved successfully.",
      user: this._mapUserToResponse(user),
    });
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

    res.status(httpStatus.OK).json({
      message: "User updated successfully.",
      user: this._mapUserToResponse(user),
    });
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

    const user = await this._userService.updatePassword({
      id: userId,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    res.status(httpStatus.OK).json({
      message: "User password updated successfully.",
      user: this._mapUserToResponse(user),
    });
  }
}
