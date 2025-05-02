/**
 * Interface representing the data transfer object for creating a refresh token.
 */
export interface ICreateRefreshTokenDto extends IClientContext {
  token: string;
  expiresAt: Date;
}

export interface IClientContext {
  clientType: string;
  userAgent: string | null;
  ipAddress: string | null;
}
