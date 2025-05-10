import type { JwtPayload } from "@/modules/shared/types";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { ISignTokenDto, IVerifyTokenDto } from "./dtos";

import type { ILoggerService } from "@/modules/shared/services";

export interface IJwtService {
  verify(verifyTokenDto: IVerifyTokenDto): IVerifyResult;
  sign(signTokenDto: ISignTokenDto): string;
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  generateAuthTokens(userId: string): IAuthResponseDto;
  isTokenExpiringSoon(exp: number): boolean;
}

export interface IJwtServiceOptions {
  loggerService: ILoggerService;
}

export interface IVerifyResult {
  jwtPayload: JwtPayload | null;
  isError: boolean;
  error: Error | null;
}
