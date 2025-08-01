import type { Request, Response } from "express";

import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
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

  async updateCurrentUser(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await userService.updateUser(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  async updateUserPassword(req: Request, res: Response) {
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
