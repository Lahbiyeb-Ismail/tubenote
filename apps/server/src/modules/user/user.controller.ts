import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";

import type { UpdatePasswordDto, UpdateUserDto } from "./dtos";
import type { User } from "./user.model";
import type { IUserController, IUserService } from "./user.types";

/**
 * Controller for handling user-related operations.
 */
export class UserController implements IUserController {
  constructor(private readonly _userService: IUserService) {}

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
    req: TypedRequest<UpdateUserDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.updateUser(userId, req.body);

    res.status(httpStatus.OK).json({
      message: "User updated successfully.",
      user: this._mapUserToResponse(user),
    });
  }

  async updatePassword(req: TypedRequest<UpdatePasswordDto>, res: Response) {
    const userId = req.userId;

    const user = await this._userService.updatePassword(userId, req.body);

    res.status(httpStatus.OK).json({
      message: "User password updated successfully.",
      user: this._mapUserToResponse(user),
    });
  }
}
