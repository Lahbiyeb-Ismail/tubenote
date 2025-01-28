import type { JwtPayload } from "@/types";

import type { AuthResponseDto } from "@modules/auth/dtos/auth.dto";
import type { SignTokenDto } from "./dtos/sign-token.dto";
import type { VerifyTokenDto } from "./dtos/verify-token.dto";

export interface IJwtService {
  verify(verifyTokenDto: VerifyTokenDto): Promise<JwtPayload>;
  sign(signTokenDto: SignTokenDto): string;
  generateAuthTokens(userId: string): AuthResponseDto;
}
