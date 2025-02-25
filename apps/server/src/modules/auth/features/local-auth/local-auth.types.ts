import type { TypedRequest } from "@/types";
import type { Response } from "express";

import type { User } from "@modules/user";

import type { ICreateBodyDto } from "@/modules/shared";
import type { ICreateUserDto } from "@/modules/user";
import type { IAuthResponseDto, ILoginDto } from "@modules/auth/dtos";

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
