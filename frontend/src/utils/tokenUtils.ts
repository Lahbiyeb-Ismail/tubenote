import { jwtDecode } from "jwt-decode";

/**
 * Checks if a given JWT token is expired.
 *
 * @param token - The JWT token to check.
 * @returns `true` if the token is expired or invalid, `false` otherwise.
 */
export function isTokenExpired(token: string) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
  } catch (error) {
    return true;
  }
}
