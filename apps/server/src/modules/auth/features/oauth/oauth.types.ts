import type { ILoggerService, IPrismaService } from "@/modules/shared/services";
import type { IUserService } from "@/modules/user";
import type { IAccountService } from "@/modules/user/features/account/account.types";
import type { IJwtService } from "../../utils";
import type { IRefreshTokenService } from "../refresh-token";

import type { IAuthResponseDto } from "../../dtos";
import type { IOauthLoginDto } from "./dtos";

export interface IOAuthService {
  handleOAuthLogin(oauthLoginDto: IOauthLoginDto): Promise<IAuthResponseDto>;
}

export interface IOAuthServiceOptions {
  prismaService: IPrismaService;
  userService: IUserService;
  accountService: IAccountService;
  refreshTokenService: IRefreshTokenService;
  jwtService: IJwtService;
  loggerService: ILoggerService;
}
