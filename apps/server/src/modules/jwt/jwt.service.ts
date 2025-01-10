import jwt from "jsonwebtoken";

import logger from "../../utils/logger";

import type { JwtPayload } from "../../types";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";

export interface IJwtService {
  verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload | null>;
  sign(signTokenDto: SignTokenDto): string;
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
}
