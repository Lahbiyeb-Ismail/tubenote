import jwt from "jsonwebtoken";

import envConfig from "@config/env.config";

import type { JwtPayload } from "@/types";
import type { IJwtService } from "./jwt.types";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { BadRequestError } from "@/errors";
import logger from "@/utils/logger";
import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";

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

  generateAuthTokens(userId: string): LoginResponseDto {
    const accessToken = this.sign({
      userId,
      secret: envConfig.jwt.access_token.secret,
      expiresIn: envConfig.jwt.access_token.expire,
    });

    const refreshToken = this.sign({
      userId,
      secret: envConfig.jwt.refresh_token.secret,
      expiresIn: envConfig.jwt.refresh_token.expire,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
