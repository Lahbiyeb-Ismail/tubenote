import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "../../types";

import type { IUserController, IUserService } from "./user.types";

import type { UpdateUserDto } from "./dtos/update-user.dto";

/**
 * Controller for handling user-related operations.
 */
export class UserController implements IUserController {
  constructor(private readonly _userService: IUserService) {}

  /**
   * Get the current user's information.
   *
   * @param req - The request object containing the user ID.
   * @param res - The response object to send the user data.
   */
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await this._userService.getUserById(userId);

    res.status(httpStatus.OK).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
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

    await this._userService.updateUser(userId, req.body);

    res.status(httpStatus.OK).json({ message: "User updated successfully." });
  }
}
