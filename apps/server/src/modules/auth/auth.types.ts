import type { Response } from "express";

import type { TypedRequest } from "../../types";

import type { User } from "../user/user.model";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshDto } from "./dtos/refresh.dto";

export interface IAuthService {
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto>;
  googleLogin(user: User): Promise<LoginResponseDto>;
  verifyEmail(userId: string): Promise<void>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
  refresh(req: TypedRequest, res: Response): Promise<void>;
  loginWithGoogle(req: TypedRequest, res: Response): Promise<void>;
}
