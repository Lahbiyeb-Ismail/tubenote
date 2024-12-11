import jwt from "jsonwebtoken";

type TokenProps = {
  userId: string;
  secret: string;
  expire: string;
};

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} secret - The secret key used to sign the token.
 * @param {string} expire - The expiration time for the token.
 * @returns {string} The signed JWT.
 */
export default function generateAuthToken({
  userId,
  secret,
  expire,
}: TokenProps): string {
  return jwt.sign({ userId }, secret, {
    expiresIn: expire,
  });
}
