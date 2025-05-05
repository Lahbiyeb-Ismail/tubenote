import type { Response } from "express";

import type { ICreateUserDto } from "@tubenote/dtos";

import type { TypedRequest } from "@/modules/shared/types";

import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";
import type { IClientContext } from "../refresh-token";

import type { IAuthResponseDto } from "../../dtos";
import type { IOAuthAuthorizationCodeDto, IOAuthTokenPayloadDto } from "./dtos";

export interface IOAuthService {
  handleOAuthLogin(
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto,
    deviceId: string,
    ipAddress: string,
    clientContext: IClientContext
  ): Promise<string>;
  generateTemporaryOAuthCode(
    temporaryOAuthCodeDto: IOAuthTokenPayloadDto
  ): Promise<string>;
  exchangeOauthCodeForTokens(code: string): Promise<IAuthResponseDto>;
}

export interface IOAuthController {
  oauthLogin(req: TypedRequest, res: Response): Promise<void>;
  exchangeOauthCodeForTokens(
    req: TypedRequest<IOAuthAuthorizationCodeDto>,
    res: Response
  ): Promise<void>;
}
