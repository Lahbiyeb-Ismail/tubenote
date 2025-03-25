import type { JwtPayload } from "@/modules/shared/types";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { ISignTokenDto, IVerifyTokenDto } from "./dtos";

import type { ILoggerService } from "@/modules/shared/services";

export interface IJwtService {
  verify(verifyTokenDto: IVerifyTokenDto): Promise<JwtPayload>;
  sign(signTokenDto: ISignTokenDto): string;
  generateAuthTokens(userId: string): IAuthResponseDto;
}

export interface IJwtServiceOptions {
  loggerService: ILoggerService;
}
