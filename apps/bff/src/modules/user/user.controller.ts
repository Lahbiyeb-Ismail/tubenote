import type { Request, Response } from "express";

import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async getCurrentUser(req: Request, res: Response) {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: "You must be logged in to view your profile" });
    }

    try {
      const data = await userService.getCurrentUser(sessionId);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }
}
