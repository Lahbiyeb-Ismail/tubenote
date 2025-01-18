import { ERROR_MESSAGES } from "../../../constants/error-messages.contants";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors";

import type { User } from "../../user/user.model";

import type { IJwtService } from "../../jwt/jwt.types";
import type { IMailSenderService } from "../../mailSender/mail-sender.types";
import type { IUserService } from "../../user/user.types";
import type { IRefreshTokenService } from "../refresh-token/refresh-token.types";
import type { ILocalAuthService } from "./local-auth.types";

import type { IPasswordHasherService } from "../../password-hasher/password-hasher.types";
import type { LoginResponseDto } from "../dtos/login-response.dto";
import type { LoginUserDto } from "../dtos/login-user.dto";
import type { RegisterUserDto } from "../dtos/register-user.dto";

export class LocalAuthService implements ILocalAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _passwordHasherService: IPasswordHasherService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = await this._userService.createUser(registerUserDto);

    await this._mailSenderService.sendVerificationEmail(newUser.email);

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
