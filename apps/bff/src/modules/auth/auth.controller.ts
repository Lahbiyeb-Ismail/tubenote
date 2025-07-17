import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { sessionIdCookieConfig } from "./config";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = await authService.register(req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { sessionId, data } = await authService.login(req.body);

      res.cookie("session_id", sessionId, sessionIdCookieConfig);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const data = await authService.logout(sessionId);

      res.clearCookie("session_id");
      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      return res.status(error.status || 500).json(error);
    }
  }

  async refresh(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const { sessionId: newSessionId, data } = await authService.refresh(sessionId);

      res.cookie("session_id", newSessionId, sessionIdCookieConfig);
      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      return res.status(error.status || 500).json(error);
    }
  }
}
