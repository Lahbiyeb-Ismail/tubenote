import type { IAuthResponseDto } from "./auth.dto";

export interface OAuthCodeDto {
  code: string;
}

export interface OAuthCodePayloadDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface OAuthResponseDto extends IAuthResponseDto {
  temporaryCode: string;
}
