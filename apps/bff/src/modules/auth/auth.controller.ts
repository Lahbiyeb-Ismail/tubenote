import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { Request, Response } from "express";

import type { TypedRequest } from "@/types";

import { AuthService } from "./auth.service";
import { sessionIdCookieConfig } from "./config";

const authService = new AuthService();

export class AuthController {
  async register(req: TypedRequest<IRegisterDto>, res: Response) {
    try {
      const data = await authService.register(req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  async login(req: TypedRequest<ILoginDto>, res: Response) {
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
    const sessionData = req.sessionData;

    try {
      const data = await authService.logout(sessionData.sessionId);

      res.clearCookie("session_id");
      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      return res.status(error.status || 500).json(error);
    }
  }
}
