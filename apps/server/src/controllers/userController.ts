import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "../types";
import type { UpdatePasswordBody, UpdateUserBody } from "../types/user.type";

import userService from "../services/userService";

/**
 * Controller for handling user-related operations.
 */
class UserController {
  /**
   * Get the current user's information.
   *
   * @param req - The request object containing the user ID.
   * @param res - The response object to send the user data.
   */
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await userService.getUserById(userId);

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
    req: TypedRequest<UpdateUserBody>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { username, email } = req.body;

    await userService.updateUser({ userId, username, email });

    res.status(httpStatus.OK).json({ message: "User updated successfully." });
  }

  /**
   * Update the current user's password.
   *
   * @param req - The request object containing the user ID and password data.
   * @param res - The response object to confirm the password update.
   */
  async updateUserPassword(
    req: TypedRequest<UpdatePasswordBody>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const { currentPassword, newPassword } = req.body;

    await userService.updatePassword({ userId, currentPassword, newPassword });

    res
      .status(httpStatus.OK)
      .json({ message: "Password updated successfully." });
  }
}

export default new UserController();
