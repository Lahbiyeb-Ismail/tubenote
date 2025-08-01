import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { Request, Response } from "express";

import type { TypedRequest } from "@/types";

import { UserService } from "./user.service";

const userService = new UserService();

/**
 * Controller for user-related operations.
 * Handles HTTP requests for user management including retrieving, updating user data and password changes.
 */
export class UserController {
  /**
   * Retrieves the current authenticated user's information.
   *
   * @param req - Express request object containing session data
   * @param res - Express response object
   * @returns Promise that resolves when the user data is sent in the response
   * @throws Will return error status and message if user retrieval fails
   */
  async getCurrentUser(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await userService.getCurrentUser(sessionData);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  /**
   * Updates the current authenticated user's profile information.
   *
   * @param req - Typed request object containing session data and update payload
   * @param res - Express response object
   * @returns Promise that resolves when the user update is completed
   * @throws Will return error status and message if user update fails
   */
  async updateCurrentUser(req: TypedRequest<IUpdateUserDto>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await userService.updateUser(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  /**
   * Updates the current authenticated user's password.
   *
   * @param req - Typed request object containing session data and password update payload
   * @param res - Express response object
   * @returns Promise that resolves when the password update is completed
   * @throws Will return error status and message if password update fails
   */
  async updateUserPassword(req: TypedRequest<IUpdatePasswordDto>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await userService.updatePassword(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }
}
