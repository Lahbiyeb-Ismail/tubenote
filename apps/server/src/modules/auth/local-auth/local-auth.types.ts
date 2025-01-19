import type { TypedRequest } from "@/types";
import type { Response } from "express";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { LoginUserDto } from "@modules/auth/dtos/login-user.dto";
import type { RegisterUserDto } from "@modules/auth/dtos/register-user.dto";
import type { User } from "@modules/user/user.model";

export interface ILocalAuthService {
  registerUser: (registerUserDto: RegisterUserDto) => Promise<User>;
  loginUser: (loginUserDto: LoginUserDto) => Promise<LoginResponseDto>;
}

export interface ILocalAuthController {
  register(req: TypedRequest<RegisterUserDto>, res: Response): Promise<void>;
  login(req: TypedRequest<LoginUserDto>, res: Response): Promise<void>;
}
