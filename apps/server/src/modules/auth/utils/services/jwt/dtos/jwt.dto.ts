/**
 * Data Transfer Object (DTO) for signing a JWT token.
 */
export interface ISignTokenDto {
  /**
   * The unique identifier of the user.
   */
  userId: string;

  /**
   * The secret key used to sign the token.
   */
  secret: string;

  /**
   * The expiration time of the token.
   */
  expiresIn: string;
}

/**
 * Data Transfer Object (DTO) for verifying a JWT token.
 */
export interface IVerifyTokenDto {
  /**
   * The JWT token to be verified.
   */
  token: string;

  /**
   * The secret key used to verify the JWT token.
   */
  secret: string;
}
