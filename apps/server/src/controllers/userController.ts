import type { Response } from "express";
import httpStatus from "http-status";
import userService from "../services/userService";
import type { TypedRequest } from "../types";
import type { UpdatePasswordBody, UpdateUserBody } from "../types/user.type";

class UserController {
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await userService.getUserById(userId);

    res.status(httpStatus.OK).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        emailVeified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async updateCurrentUser(
    req: TypedRequest<UpdateUserBody>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { username, email } = req.body;

    await userService.updateUser({ userId, username, email });

    res.status(httpStatus.OK).json({ message: "User updated successfully." });
  }

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
