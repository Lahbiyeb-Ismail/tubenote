import jwt from "jsonwebtoken";

import logger from "@utils/logger";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError } from "@/errors";

import type { JwtPayload } from "@/types";
import type { IAuthResponseDto } from "@modules/auth/dtos/auth.dto";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";
import type { IJwtService } from "./jwt.types";

export class JwtService implements IJwtService {
  async verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload> {
    const { token, secret } = verifyTokenDto;
    const payload = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          logger.error(`Error verifying token: ${err.message}`);

          reject(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });

    return payload;
  }

  sign(signTokenDto: SignTokenDto): string {
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
