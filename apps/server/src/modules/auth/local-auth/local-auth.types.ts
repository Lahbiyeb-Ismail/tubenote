import type { Response } from "express";
import type { TypedRequest } from "../../../types";

import type { UpdatePasswordDto } from "../../../common/dtos/update-password.dto";
import type { User } from "../../user/user.model";
import type { LoginResponseDto } from "../dtos/login-response.dto";
import type { LoginUserDto } from "../dtos/login-user.dto";
import type { RegisterUserDto } from "../dtos/register-user.dto";

export interface ILocalAuthService {
  registerUser: (registerUserDto: RegisterUserDto) => Promise<User>;
  loginUser: (loginUserDto: LoginUserDto) => Promise<LoginResponseDto>;
  updatePassword: (
    userId: string,
    updatePasswordDto: UpdatePasswordDto
  ) => Promise<User>;
}

export interface ILocalAuthController {
  register(req: TypedRequest<RegisterUserDto>, res: Response): Promise<void>;
  login(req: TypedRequest<LoginUserDto>, res: Response): Promise<void>;
}
