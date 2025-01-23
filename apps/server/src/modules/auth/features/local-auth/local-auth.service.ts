import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { User } from "@modules/user/user.model";

import { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import type { IRefreshTokenService } from "@modules/auth/features/refresh-token/refresh-token.types";
import type { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import type { IUserService } from "@modules/user/user.types";
import type { ILocalAuthService } from "./local-auth.types";

import type { IPasswordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.types";
import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { LoginUserDto } from "@modules/auth/dtos/login-user.dto";
import type { RegisterUserDto } from "@modules/auth/dtos/register-user.dto";
import type { IVerifyEmailService } from "../verify-email/verify-email.types";

export class LocalAuthService implements ILocalAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _passwordHasherService: IPasswordHasherService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
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

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

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

    await this._refreshTokenService.createToken({
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
