import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { ForbiddenError, UnauthorizedError } from "@/modules/shared/api-errors";
import { stringToDate } from "@/modules/shared/utils";

import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type {
  ICryptoService,
  IMailSenderService,
} from "@/modules/shared/services";

import type { IRefreshTokenService } from "../refresh-token";
import type { IVerifyEmailService } from "../verify-email";

import { REFRESH_TOKEN_EXPIRES_IN } from "../../constants";

import type { IAuthResponseDto, ILoginDto } from "../../dtos";
import type { IJwtService } from "../../utils";

import type { ILocalAuthService } from "./local-auth.types";

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
