import { ERROR_MESSAGES } from "@modules/shared";

import { stringToDate } from "@utils/convert-string-to-date";

import {
  ForbiddenError,
  ICryptoService,
  IMailSenderService,
  UnauthorizedError,
} from "@modules/shared";

import type { ICreateUserDto, IUserService, User } from "@modules/user";

import type {
  IAuthResponseDto,
  IJwtService,
  ILocalAuthService,
  ILoginDto,
  IRefreshTokenService,
  IVerifyEmailService,
} from "@modules/auth";

import { REFRESH_TOKEN_EXPIRES_IN } from "../../constants";

export class LocalAuthService implements ILocalAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _cryptoService: ICryptoService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async registerUser(createUserDto: ICreateUserDto): Promise<User> {
    const newUser = await this._userService.createUser(createUserDto);

    const verifyEmailToken = await this._verifyEmailService.generateToken(
      newUser.email
    );

    await this._mailSenderService.sendVerificationEmail(
      newUser.email,
      verifyEmailToken
    );

    return newUser;
  }

  async loginUser(loginDto: ILoginDto): Promise<IAuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this._userService.getUser({ email });

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
