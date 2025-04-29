/**
 * Data Transfer Object (DTO)
 *
 * @interface HashValidationDto
 *
 * @property {string} plainText - The plain text value to be compared.
 * @property {string} hash - The hashed value to compare against.
 */
export interface HashValidationDto {
  unhashedValue: string;
  hashedValue: string;
}
