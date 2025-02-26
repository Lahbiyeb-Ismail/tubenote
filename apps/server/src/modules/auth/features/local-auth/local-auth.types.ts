import type { TypedRequest } from "@modules/shared";
import type { Response } from "express";

import type { ICreateBodyDto } from "@/modules/shared";
import type { IAuthResponseDto, ILoginDto } from "@modules/auth";
import type { ICreateUserDto, User } from "@modules/user";

export interface ILocalAuthService {
  registerUser: (createUserDto: ICreateUserDto) => Promise<User>;
  loginUser: (loginDto: ILoginDto) => Promise<IAuthResponseDto>;
}

export interface ILocalAuthController {
  register(
    req: TypedRequest<ICreateBodyDto<User>>,
    res: Response
  ): Promise<void>;
  login(req: TypedRequest<ILoginDto>, res: Response): Promise<void>;
}
