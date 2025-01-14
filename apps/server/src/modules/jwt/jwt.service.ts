import jwt from "jsonwebtoken";

import envConfig from "../../config/envConfig";
import logger from "../../utils/logger";

import type { JwtPayload } from "../../types";
import type { LoginResponseDto } from "../auth/dtos/login-response.dto";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";

export interface IJwtService {
  verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload | null>;
  sign(signTokenDto: SignTokenDto): string;
  generateAuthTokens(userId: string): LoginResponseDto;
}

export class JwtService implements IJwtService {
  async verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload | null> {
    const { token, secret } = verifyTokenDto;

    return new Promise((resolve, _reject) => {
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          logger.error(`Error verifying token: ${err}`);
          resolve(null);
        }

        resolve(payload as JwtPayload);
      });
    });
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
