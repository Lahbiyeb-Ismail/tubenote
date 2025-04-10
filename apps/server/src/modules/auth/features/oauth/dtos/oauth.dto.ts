import type { ICreateUserDto } from "@tubenote/dtos";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";

/**
 * Data Transfer Object (DTO) for OAuth login.
 *
 * This interface defines the structure of the data required for an OAuth login process,
 * including the details for creating a user and an account.
 */
export interface IOauthLoginDto {
  createUserDto: ICreateUserDto;
  createAccountDto: ICreateAccountDto;
}

/**
 * Data Transfer Object (DTO) for OAuth authorization code.
 *
 * This interface represents the structure of the data required
 * for handling OAuth authorization codes.
 */
export interface IOAuthAuthorizationCodeDto {
  code: string;
}

/**
 * Represents the payload of an OAuth token.
 */
export interface IOAuthTokenPayloadDto {
  /**
   * The unique identifier of the user.
   */
  userId: string;

  /**
   * The access token issued for the user.
   */
  accessToken: string;

  /**
   * The refresh token issued for the user.
   */
  refreshToken: string;
}

/**
 * Represents the response DTO for OAuth authentication.
 * Extends the base authentication response DTO with additional
 * properties specific to OAuth.
 */
export interface IOAuthResponseDto extends IAuthResponseDto {
  temporaryCode: string;
}
