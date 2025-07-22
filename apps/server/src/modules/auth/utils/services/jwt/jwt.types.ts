import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { ILoggerService } from "@/modules/shared/services";
import type { JwtPayload } from "@/modules/shared/types";

import type { ISignTokenDto, IVerifyTokenDto } from "./dtos";

export interface IJwtService {
  verify: (verifyTokenDto: IVerifyTokenDto) => JwtPayload | Error;
  sign: (signTokenDto: ISignTokenDto) => string;
  generateAccessToken: (userId: string) => string;
  generateRefreshToken: (userId: string) => string;
  generateAuthTokens: (userId: string) => IAuthResponseDto;
  isTokenExpiringSoon: (exp: number) => boolean;
}

export interface IJwtServiceOptions {
  loggerService: ILoggerService;
}

export interface IVerifyResult {
  jwtPayload: JwtPayload | null;
  isError: boolean;
  error: Error | null;
}
