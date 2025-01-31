import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { AuthResponseDto, LogoutDto, OAuthCodeDto } from "./dtos";

export interface IAuthService {
  logoutUser(logoutUserDto: LogoutDto): Promise<void>;
  exchangeOauthCodeForTokens(code: string): Promise<AuthResponseDto>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
  exchangeOauthCodeForTokens(
    req: TypedRequest<OAuthCodeDto>,
    res: Response
  ): Promise<void>;
}
