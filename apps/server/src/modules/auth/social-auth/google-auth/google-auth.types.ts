import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { User } from "@modules/user/user.model";

export interface IGoogleAuthService {
  googleLogin(user: User): Promise<LoginResponseDto>;
}
export interface IGoogleAuthController {
  googleLogin(req: TypedRequest, res: Response): Promise<void>;
}
