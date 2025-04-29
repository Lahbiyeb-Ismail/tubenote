import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { User } from "@tubenote/types";

import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import type { IUserService } from "@/modules/user";

import type {
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IPrismaService,
} from "@/modules/shared/services";

import type {
  IClientContext,
  IRefreshTokenService,
  IVerifyEmailService,
} from "@/modules/auth/features";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";
import type {
  ILocalAuthService,
  ILocalAuthServiceOptions,
} from "./local-auth.types";

export class LocalAuthService implements ILocalAuthService {
  private static _instance: LocalAuthService;

  private constructor(
    private readonly _prismaService: IPrismaService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _jwtService: IJwtService,
    private readonly _cryptoService: ICryptoService,
    private readonly _mailSenderService: IMailSenderService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(
    options: ILocalAuthServiceOptions
  ): LocalAuthService {
    if (!this._instance) {
      this._instance = new LocalAuthService(
        options.prismaService,
        options.userService,
        options.verifyEmailService,
        options.refreshTokenService,
        options.jwtService,
        options.cryptoService,
        options.mailSenderService,
        options.loggerService
      );
    }
    return this._instance;
  }

  async registerUser(registerUserDto: IRegisterDto): Promise<User | undefined> {
    let newUser: User | undefined;
    let verifyEmailToken: string | undefined;

    const createAccountDto: ICreateAccountDto = {
      provider: "credentials",
      providerAccountId: registerUserDto.email,
      type: "email",
    };

    await this._prismaService.transaction(async (tx) => {
      newUser = await this._userService.createUserWithAccount(
        tx,
        registerUserDto,
        createAccountDto
      );

      verifyEmailToken = await this._verifyEmailService.createToken(
        tx,
        newUser.email
      );
    });

    // Only send the email **after** the transaction is committed
    if (newUser && verifyEmailToken) {
      await this._mailSenderService.sendVerificationEmail(
        newUser.email,
        verifyEmailToken
      );
    }

    return newUser;
  }

  async loginUser(
    loginDto: ILoginDto,
    clientContext: IClientContext
  ): Promise<IAuthResponseDto> {
    const { email, password } = loginDto;

    // Get the user first to check if they exist
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      this._loggerService.warn("Login attempt with non-existent email", {
        email,
      });

      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED);
    }

    const isPasswordMatch = await this._cryptoService.validateHashMatch({
      unhashedValue: password,
      hashedValue: user.password,
    });

    if (!isPasswordMatch) {
      this._loggerService.warn("Failed login attempt - invalid password", {
        userId: user.id,
        email,
      });

      throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Store refresh token
    const refreshToken = await this._refreshTokenService.createToken(
      user.id,
      clientContext
    );

    const accessToken = this._jwtService.generateAccessToken(user.id);

    this._loggerService.info("User logged in successfully", {
      userId: user.id,
      email,
    });

    return { accessToken, refreshToken };
  }
}
