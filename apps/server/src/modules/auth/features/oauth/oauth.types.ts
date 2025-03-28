import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { IUserService } from "@/modules/user";
import type { IAccountService } from "@/modules/user/features/account/account.types";
import type { IJwtService } from "../../utils";
import type { IRefreshTokenService } from "../refresh-token";

import type { TypedRequest } from "@/modules/shared/types";
import type { Response } from "express";
import type {
  IAuthResponseDto,
  OAuthCodeDto,
  OAuthCodePayloadDto,
  OAuthResponseDto,
} from "../../dtos";
import type { IOauthLoginDto } from "./dtos";

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
  handleOAuthLogin(oauthLoginDto: IOauthLoginDto): Promise<OAuthResponseDto>;
  generateTemporaryOAuthCode(
    temporaryOAuthCodeDto: OAuthCodePayloadDto
  ): Promise<string>;
  exchangeOauthCodeForTokens(code: string): Promise<IAuthResponseDto>;
}

export interface IOAuthController {
  oauthLogin(req: TypedRequest, res: Response): Promise<void>;
  exchangeOauthCodeForTokens(
    req: TypedRequest<OAuthCodeDto>,
    res: Response
  ): Promise<void>;
}
