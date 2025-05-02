import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import { BadRequestError } from "@/modules/shared/api-errors";
import {
  type ICacheService,
  type ICryptoService,
  type ILoggerService,
  type IPrismaService,
} from "@/modules/shared/services";

import type { IUserService } from "@/modules/user";
import type { IAccountService } from "@/modules/user/features/account/account.types";

import type { IClientContext, IRefreshTokenService } from "../refresh-token";

import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";
import type { ICreateUserDto } from "@tubenote/dtos";
import type { IOAuthTokenPayloadDto } from "./dtos";
import type { IOAuthService, IOAuthServiceOptions } from "./oauth.types";

export class OAuthService implements IOAuthService {
  private static _instance: OAuthService;

  private constructor(
    private readonly _prismaService: IPrismaService,
    private readonly _userService: IUserService,
    private readonly _accountService: IAccountService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _jwtService: IJwtService,
    private readonly _cryptoService: ICryptoService,
    private readonly _cacheService: ICacheService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(options: IOAuthServiceOptions): OAuthService {
    if (!this._instance) {
      this._instance = new OAuthService(
        options.prismaService,
        options.userService,
        options.accountService,
        options.refreshTokenService,
        options.jwtService,
        options.cryptoService,
        options.cacheService,
        options.loggerService
      );
    }

    return this._instance;
  }

  async generateTemporaryOAuthCode(
    temporaryOAuthCodeDto: IOAuthTokenPayloadDto
  ): Promise<string> {
    const code = this._cryptoService.generateSecureToken();

    const setResult = this._cacheService.set<IOAuthTokenPayloadDto>(code, {
      ...temporaryOAuthCodeDto,
    });

    this._loggerService.info(`Code ${code} set in cache: ${setResult}`);
    this._loggerService.info(
      `Cache stats after set: ${this._cacheService.getStats()}`
    );

    return code;
  }

  // New method for OAuth login/signup
  async handleOAuthLogin(
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto,
    deviceId: string,
    ipAddress: string,
    clientContext: IClientContext
  ): Promise<string> {
    return this._prismaService.transaction<string>(async (tx) => {
      let userId: string;

      // Try to find existing account for this OAuth provider
      const existingAccount = await this._accountService.findAccountByProvider(
        createAccountDto.provider,
        createAccountDto.providerAccountId
      );

      if (existingAccount) {
        // Account exists, login flow
        this._loggerService.info(
          `User with ID ${existingAccount.userId} logged in with ${createAccountDto.provider}.`
        );

        userId = existingAccount.userId;
      } else {
        // Account doesn't exist, create user and account
        this._loggerService.info(
          `User with email ${createUserDto.email} signed up with ${createAccountDto.provider}.`
        );

        const user = await this._userService.createUserWithAccount(
          tx,
          createUserDto,
          createAccountDto
        );

        userId = user.id;
      }

      this._loggerService.info(
        `Saving refresh token for user with ID ${userId}.`
      );

      const refreshToken = await this._refreshTokenService.createToken(
        userId,
        deviceId,
        ipAddress,
        clientContext
      );

      this._loggerService.info(
        `Generating access token for user with ID ${userId}.`
      );

      const accessToken = this._jwtService.generateAccessToken(userId);

      const temporaryOauthCode = await this.generateTemporaryOAuthCode({
        accessToken,
        refreshToken,
        userId,
      });

      return temporaryOauthCode;
    });
  }

  async exchangeOauthCodeForTokens(code: string): Promise<IAuthResponseDto> {
    const codeData = this._cacheService.get<IOAuthTokenPayloadDto>(code);

    this._loggerService.info(`Retrieved codeData: ${codeData}`);

    if (!codeData) {
      this._loggerService.error(`Code ${code} not found in cache`);
      throw new BadRequestError("Invalid or expired code");
    }

    const deleteResult = this._cacheService.del(code);

    this._loggerService.warn(`Deleted ${deleteResult} items from cache`);

    return {
      accessToken: codeData.accessToken,
      refreshToken: codeData.refreshToken,
    };
  }
}
