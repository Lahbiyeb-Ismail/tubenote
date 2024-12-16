import type { Response } from "express";
import httpStatus from "http-status";
import authService from "../services/authService";
import type { TypedRequest } from "../types";
import type { RegisterCredentials } from "../types/auth.type";

class AuthController {
  async register(req: TypedRequest<RegisterCredentials>, res: Response) {
    const { username, email, password } = req.body;

    const user = await authService.registerUser({ username, email, password });

    res.status(httpStatus.CREATED).json({
      message: "A verification email has been sent to your email.",
      email: user.email,
    });
  }
}

export default new AuthController();
