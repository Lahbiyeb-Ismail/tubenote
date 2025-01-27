import type { LoginResponseDto } from "@/modules/auth/dtos/login-response.dto";

export interface OauthLoginResponseDto extends LoginResponseDto {
  temporaryCode: string;
}
