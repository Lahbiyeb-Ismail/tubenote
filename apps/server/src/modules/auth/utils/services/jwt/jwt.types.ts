import type { JwtPayload } from "@modules/shared";

import type {
  IAuthResponseDto,
  ISignTokenDto,
  IVerifyTokenDto,
} from "@modules/auth";

export interface IJwtService {
  verify(verifyTokenDto: IVerifyTokenDto): Promise<JwtPayload>;
  sign(signTokenDto: ISignTokenDto): string;
  generateAuthTokens(userId: string): IAuthResponseDto;
}
