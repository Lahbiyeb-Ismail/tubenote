import { ERROR_MESSAGES } from "../../../../constants/error-messages.contants";
import { NotFoundError, UnauthorizedError } from "../../../../errors";
import type { IJwtService } from "../../../jwt/jwt.types";
import type { User } from "../../../user/user.model";
import type { LoginResponseDto } from "../../dtos/login-response.dto";
import type { IRefreshTokenService } from "../../refresh-token/refresh-token.types";
import type { IGoogleAuthService } from "./google-auth.types";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  async googleLogin(user: User): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
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
