import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@modules/auth";

import { BadRequestError, ERROR_MESSAGES } from "@modules/shared";

import type {
  IAuthResponseDto,
  IJwtService,
  ISignTokenDto,
  IVerifyTokenDto,
} from "@modules/auth";

import type { ILoggerService, JwtPayload } from "@modules/shared";

export class JwtService implements IJwtService {
  constructor(private readonly _loggerService: ILoggerService) {}

  async verify(verifyTokenDto: IVerifyTokenDto): Promise<JwtPayload> {
    const { token, secret } = verifyTokenDto;
    const payload = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          this._loggerService.error(`Error verifying token: ${err.message}`);

          reject(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });

    return payload;
  }

  sign(signTokenDto: ISignTokenDto): string {
    const { userId, secret, expiresIn } = signTokenDto;

    return jwt.sign({ userId }, secret, {
      expiresIn,
    });
  }

  generateAuthTokens(userId: string): IAuthResponseDto {
    const accessToken = this.sign({
      userId,
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.sign({
      userId,
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
