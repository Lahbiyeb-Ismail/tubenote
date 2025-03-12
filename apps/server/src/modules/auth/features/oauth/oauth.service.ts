import { stringToDate } from "@/modules/shared/utils";
import { REFRESH_TOKEN_EXPIRES_IN } from "../../constants";

import {
  type ILoggerService,
  type IPrismaService,
} from "@/modules/shared/services";
import type { IUserService } from "@/modules/user";
import type { IAccountService } from "@/modules/user/features/account/account.types";
import type { IJwtService } from "../../utils";
import type { IRefreshTokenService } from "../refresh-token";

import type { IAuthResponseDto } from "../../dtos";
import type { IOauthLoginDto } from "./dtos";

import type { IOAuthService, IOAuthServiceOptions } from "./oauth.types";

export class OAuthService implements IOAuthService {
  private static instance: OAuthService;
  private readonly _prismaService: IPrismaService;
  private readonly _userService: IUserService;
  private readonly _accountService: IAccountService;
  private readonly _refreshTokenService: IRefreshTokenService;
  private readonly _jwtService: IJwtService;
  private readonly _loggerService: ILoggerService;

  constructor(options: IOAuthServiceOptions) {
    this._prismaService = options.prismaService;
    this._userService = options.userService;
    this._accountService = options.accountService;
    this._refreshTokenService = options.refreshTokenService;
    this._jwtService = options.jwtService;
    this._loggerService = options.loggerService;
  }

  static getInstance(options: IOAuthServiceOptions): OAuthService {
    if (!OAuthService.instance) {
      this.instance = new OAuthService(options);
    }

    return OAuthService.instance;
  }

  // New method for OAuth login/signup
  async handleOAuthLogin(
    oauthLoginDto: IOauthLoginDto
  ): Promise<IAuthResponseDto> {
    const { createAccountDto, createUserDto } = oauthLoginDto;

    const authResponse =
      await this._prismaService.transaction<IAuthResponseDto>(async (tx) => {
        let userId: string;

        // Try to find existing account for this OAuth provider
        const existingAccount =
          await this._accountService.findAccountByProvider(
            createAccountDto.data.provider,
            createAccountDto.data.providerAccountId
          );

        if (existingAccount) {
          // Account exists, login flow
          this._loggerService.info(
            `User with ID ${existingAccount.userId} logged in with ${createAccountDto.data.provider}.`
          );

          userId = existingAccount.userId;
        } else {
          // Account doesn't exist, create user and account
          this._loggerService.info(
            `User with email ${createUserDto.data.email} signed up with ${createAccountDto.data.provider}.`
          );

          const user = await this._userService.createUserWithAccount(
            tx,
            createUserDto,
            createAccountDto
          );

          userId = user.id;
        }

        // Generate tokens and save refresh token
        this._loggerService.info(
          `Generating auth tokens for user with ID ${userId}.`
        );

        const { accessToken, refreshToken } =
          this._jwtService.generateAuthTokens(userId);

        this._loggerService.info(
          `Saving refresh token for user with ID ${userId}.`
        );

        await this._refreshTokenService.createToken({
          userId,
          data: {
            token: refreshToken,
            expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
          },
        });

        return { accessToken, refreshToken };
      });

    return authResponse;
  }
}
