/**
 * Interface representing the data transfer object for creating a refresh token.
 */
export interface ICreateRefreshTokenDto {
  token: string;
  expiresAt: Date;
}
