import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { Request, Response } from "express";

import type { TypedRequest } from "@/types";

import { AuthService } from "./auth.service";
import { sessionIdCookieConfig } from "./config";

const authService = new AuthService();

/**
 * Controller class responsible for handling authentication-related HTTP requests.
 * Provides endpoints for user registration, login, and logout operations.
 */
export class AuthController {
  /**
   * Handles user registration requests.
   *
   * @param req - The typed request object containing registration data
   * @param res - The HTTP response object
   * @returns Promise that resolves when registration is complete
   * @throws Will return error response with appropriate status code if registration fails
   */
  async register(req: TypedRequest<IRegisterDto>, res: Response) {
    try {
      const data = await authService.register(req.body);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  /**
   * Handles user login requests and establishes a session.
   * Sets a session cookie upon successful authentication.
   *
   * @param req - The typed request object containing login credentials
   * @param res - The HTTP response object
   * @returns Promise that resolves when login is complete
   * @throws Will throw error if login process fails
   */
  async login(req: TypedRequest<ILoginDto>, res: Response) {
    try {
      const { sessionId, data } = await authService.login(req.body);

      res.cookie("session_id", sessionId, sessionIdCookieConfig);

      res.status(data.statusCode).json(data);
    }
    catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  }

  /**
   * Handles user logout requests and clears the session.
   * Removes the session cookie and invalidates the user session.
   *
   * @param req - The HTTP request object containing session data
   * @param res - The HTTP response object
   * @returns Promise that resolves when logout is complete
   * @throws Will return error response with appropriate status code if logout fails
   */
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
