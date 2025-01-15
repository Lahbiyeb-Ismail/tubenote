import type { Response } from "express";

import type { TypedRequest } from "../../types";

import type { UserDto } from "../user/dtos/user.dto";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LoginUserDto } from "./dtos/login-user.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshDto } from "./dtos/refresh.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";

export interface IAuthService {
  registerUser(registerUserDto: RegisterUserDto): Promise<UserDto>;
  loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto>;
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto>;
  googleLogin(user: UserDto): Promise<LoginResponseDto>;
  verifyEmail(userId: string): Promise<void>;
}

export interface IAuthController {
  register(req: TypedRequest<RegisterUserDto>, res: Response): Promise<void>;
  login(req: TypedRequest<LoginUserDto>, res: Response): Promise<void>;
  logout(req: TypedRequest, res: Response): Promise<void>;
  refresh(req: TypedRequest, res: Response): Promise<void>;
  loginWithGoogle(req: TypedRequest, res: Response): Promise<void>;
}
