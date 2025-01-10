/**
 * Represents a Google user.
 *
 * @property {string} sub - The unique identifier for the user.
 * @property {string} email - The user's email address.
 * @property {boolean} email_verified - Indicates whether the user's email address has been verified.
 * @property {string} name - The user's full name.
 * @property {string} given_name - The user's given name (first name).
 * @property {string} family_name - The user's family name (last name).
 * @property {string} picture - The URL of the user's profile picture.
 */
export type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};
