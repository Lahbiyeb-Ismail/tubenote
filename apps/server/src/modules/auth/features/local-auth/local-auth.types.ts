import type { TypedRequest } from "@/types";
import type { Response } from "express";

import type { User } from "@modules/user/user.model";

import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "@modules/auth/dtos";

export interface ILocalAuthService {
  registerUser: (registerDto: RegisterDto) => Promise<User>;
  loginUser: (loginDto: LoginDto) => Promise<AuthResponseDto>;
}

export interface ILocalAuthController {
  register(req: TypedRequest<RegisterDto>, res: Response): Promise<void>;
  login(req: TypedRequest<LoginDto>, res: Response): Promise<void>;
}
