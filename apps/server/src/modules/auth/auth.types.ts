import type { Response } from "express";

import type { TypedRequest } from "@modules/shared";

import type { IAuthResponseDto, ILogoutDto, OAuthCodeDto } from "@modules/auth";

export interface IAuthService {
  logoutUser(logoutDto: ILogoutDto): Promise<void>;
  exchangeOauthCodeForTokens(code: string): Promise<IAuthResponseDto>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
  exchangeOauthCodeForTokens(
    req: TypedRequest<OAuthCodeDto>,
    res: Response
  ): Promise<void>;
}
