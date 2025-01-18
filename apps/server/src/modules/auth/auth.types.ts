import type { Response } from "express";

import type { TypedRequest } from "../../types";

import type { User } from "../user/user.model";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";

export interface IAuthService {
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  googleLogin(user: User): Promise<LoginResponseDto>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
  loginWithGoogle(req: TypedRequest, res: Response): Promise<void>;
}
