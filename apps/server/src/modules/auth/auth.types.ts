import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { OauthCodeBodyDto } from "./dtos/oauth-temp-code-body.dto";

export interface IAuthService {
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  exchangeOauthCodeForTokens(code: string): Promise<LoginResponseDto>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
  exchangeOauthCodeForTokens(
    req: TypedRequest<OauthCodeBodyDto>,
    res: Response
  ): Promise<void>;
}
