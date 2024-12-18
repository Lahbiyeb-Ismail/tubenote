import type { Response } from "express";
import httpStatus from "http-status";
import userService from "../services/userService";
import type { TypedRequest } from "../types";

class UserController {
  async getCurrentUser(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await userService.getUser(userId);

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
}

export default new UserController();
