/**
 * Data Transfer Object (DTO) for comparing passwords.
 *
 * @interface ComparePasswordDto
 *
 * @property {string} plainText - The plain text password to be compared.
 * @property {string} hash - The hashed password to compare against.
 */
export interface ComparePasswordDto {
  plainText: string;
  hash: string;
}
