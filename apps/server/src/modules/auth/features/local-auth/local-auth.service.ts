import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/errors";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";

import { ILocalAuthService } from "./local-auth.types";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import { IPasswordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.types";

import { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import { IUserService } from "@modules/user/user.types";

import { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";
import type { IVerifyEmailService } from "@modules/auth/features/verify-email/verify-email.types";

import type { User } from "@modules/user/user.model";

import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "@modules/auth/dtos";

export class LocalAuthService implements ILocalAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _passwordHasherService: IPasswordHasherService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async registerUser(registerUserDto: RegisterDto): Promise<User> {
    const newUser = await this._userService.createUser(registerUserDto);

    const verifyEmailToken = await this._verifyEmailService.generateToken(
      newUser.email
    );

    await this._mailSenderService.sendVerificationEmail(
      newUser.email,
      verifyEmailToken
    );

    return newUser;
  }

  async loginUser(LoginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = LoginDto;

    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordMatch = await this._passwordHasherService.comparePassword({
      password,
      hashedPassword: user.password,
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
