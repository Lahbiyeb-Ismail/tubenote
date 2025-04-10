import type { Response } from "express";

import type { ICreateUserDto } from "@tubenote/dtos";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { IUserService } from "@/modules/user";
import type { IAccountService } from "@/modules/user/features/account/account.types";
import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import type { IRefreshTokenService } from "../refresh-token";

import type {
  IOAuthAuthorizationCodeDto,
  IOAuthResponseDto,
  IOAuthTokenPayloadDto,
} from "./dtos";

export interface IOAuthServiceOptions {
  prismaService: IPrismaService;
  userService: IUserService;
  accountService: IAccountService;
  refreshTokenService: IRefreshTokenService;
  jwtService: IJwtService;
  cryptoService: ICryptoService;
  cacheService: ICacheService;
  loggerService: ILoggerService;
}

export interface IOAuthControllerOptions {
  oauthService: IOAuthService;
  responseFormatter: IResponseFormatter;
}

export interface IOAuthService {
  handleOAuthLogin(
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto
  ): Promise<IOAuthResponseDto>;
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
