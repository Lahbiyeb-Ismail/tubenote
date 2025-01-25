import type { JwtPayload } from "@/types";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";

export interface IJwtService {
  verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload>;
  sign(signTokenDto: SignTokenDto): string;
  generateAuthTokens(userId: string): LoginResponseDto;
}
