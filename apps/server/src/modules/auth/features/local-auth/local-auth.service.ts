import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { stringToDate } from "@/modules/shared/utils";

import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type {
  ICryptoService,
  IMailSenderService,
  IPrismaService,
} from "@/modules/shared/services";

import type {
  IRefreshTokenService,
  IVerifyEmailService,
} from "@/modules/auth/features";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import type {
  ILocalAuthService,
  ILocalAuthServiceOptions,
} from "./local-auth.types";

export class LocalAuthService implements ILocalAuthService {
  private static instance: LocalAuthService;

  constructor(
    private readonly _prismaService: IPrismaService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _jwtService: IJwtService,
    private readonly _cryptoService: ICryptoService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  static getInstance(options: ILocalAuthServiceOptions): LocalAuthService {
    if (!LocalAuthService.instance) {
      LocalAuthService.instance = new LocalAuthService(
        options.prismaService,
        options.userService,
        options.verifyEmailService,
        options.refreshTokenService,
        options.jwtService,
        options.cryptoService,
        options.mailSenderService
      );
    }
    return LocalAuthService.instance;
  }

  async registerUser(createUserDto: ICreateUserDto): Promise<User | undefined> {
    let newUser: User | undefined;
    let verifyEmailToken: string | undefined;

    await this._prismaService.transaction(async (tx) => {
      newUser = await this._userService.createUserWithAccount(
        tx,
        createUserDto,
        {
          data: {
            provider: "credentials",
            providerAccountId: createUserDto.data.email,
            type: "email",
          },
        }
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

  async loginUser(loginDto: ILoginDto): Promise<IAuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this._userService.getUserByIdOrEmail({ email });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED);
    }

    const isPasswordMatch = await this._cryptoService.comparePasswords({
      plainText: password,
      hash: user.password,
    });

    if (!isPasswordMatch) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
      user.id
    );

    await this._refreshTokenService.createToken({
      userId: user.id,
      data: {
        token: refreshToken,
        expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
      },
    });

    return { accessToken, refreshToken };
  }
}
