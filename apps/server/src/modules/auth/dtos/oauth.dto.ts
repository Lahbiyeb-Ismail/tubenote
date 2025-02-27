import type { IAuthResponseDto } from "@modules/auth";

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
