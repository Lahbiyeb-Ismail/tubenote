import { ForbiddenError, UnauthorizedError } from "@/errors";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";

import { ILocalAuthService } from "./local-auth.types";

import { IJwtService } from "@modules/auth/utils/services/jwt/jwt.types";
import { ICryptoService } from "@modules/utils/crypto";

import { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import { type ICreateUserDto, IUserService } from "@modules/user";

import { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";
import type { IVerifyEmailService } from "@modules/auth/features/verify-email/verify-email.types";

import type { User } from "@modules/user/user.model";

import type { IAuthResponseDto, ILoginDto } from "@modules/auth/dtos";

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
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
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

    await this._refreshTokenService.saveToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
    });

    return { accessToken, refreshToken };
  }
}
