import { TYPES } from "@/config/inversify/types";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

import type { ILoggerService } from "@/modules/shared/services";
import type { JwtPayload } from "@/modules/shared/types";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@/modules/auth/constants";
import type { IAuthResponseDto } from "@/modules/auth/dtos";

import type { ISignTokenDto, IVerifyTokenDto } from "./dtos";
import type { IJwtService, IVerifyResult } from "./jwt.types";

@injectable()
export class JwtService implements IJwtService {
  // Define the minimum remaining validity time in milliseconds (3 minutes)
  private readonly MIN_TOKEN_VALIDITY_MS: number = 3 * 60 * 1000; // 3 minutes

  constructor(
    @inject(TYPES.LoggerService) private readonly _loggerService: ILoggerService
  ) {}

  verify(verifyTokenDto: IVerifyTokenDto): IVerifyResult {
    const { token, secret } = verifyTokenDto;

    try {
      const jwtPayload = jwt.verify(token, secret) as JwtPayload;

      return {
        jwtPayload,
        isError: false,
        error: null,
      };
    } catch (err) {
      return {
        jwtPayload: null,
        isError: true,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  sign(signTokenDto: ISignTokenDto): string {
    const { userId, secret, expiresIn } = signTokenDto;

    return jwt.sign({ userId }, secret, {
      expiresIn,
    });
  }

  generateAccessToken(userId: string): string {
    return this.sign({
      userId,
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId: string): string {
    return this.sign({
      userId,
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  generateAuthTokens(userId: string): IAuthResponseDto {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  /**
   * Checks if a token is expiring soon, specifically within a predefined time window.
   *
   * @param exp - The expiration time of the token in seconds since the Unix epoch.
   * @returns `true` if the token is expiring soon (within 3 minutes), otherwise `false`.
   *
   * @remarks
   * - The method calculates the remaining validity of the token by comparing the current time
   *   with the token's expiration time.
   * - If the remaining validity is less than the minimum token validity threshold, a warning
   *   is logged, and the method returns `true`.
   *
   * @example
   * ```typescript
   * const exp = Math.floor(Date.now() / 1000) + 120; // Token expires in 2 minutes
   * const isExpiringSoon = jwtService.isTokenExpiringSoon(exp);
   * console.log(isExpiringSoon); // Output: true
   * ```
   */
  isTokenExpiringSoon(exp: number): boolean {
    // Check if token is expiring soon (within 3 minutes)
    const currentTimeMs = Date.now();
    const expirationTimeMs = exp * 1000; // Convert seconds to milliseconds
    const timeRemainingMs = expirationTimeMs - currentTimeMs;

    if (timeRemainingMs < this.MIN_TOKEN_VALIDITY_MS) {
      this._loggerService.warn(
        `Token is expiring soon. Remaining validity: ${Math.floor(
          timeRemainingMs / 1000
        )} seconds.`
      );

      return true;
    }

    return false;
  }
}
