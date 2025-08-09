import bcrypt from "bcryptjs";
import { injectable } from "inversify";
import { createHash, randomBytes } from "node:crypto";

import type { ICryptoService } from "./crypto.types";
import type { HashValidationDto } from "./dtos";

import { envConfig } from "../../config";

@injectable()
export class CryptoService implements ICryptoService {
  private readonly SALT_ROUNDS = 12;
  private readonly TOKEN_BYTES = 64;

  /**
   * Hashes a plain-text password.
   * @param rawValue - The plain-text password to hash.
   * @returns The hashed password.
   */
  async generateHash(rawValue: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);

    return await bcrypt.hash(rawValue, salt);
  }

  /**
   * Compares a plain-text password with a hashed password.
   * @param hashValidationDto - The DTO containing the values to compare.
   * @returns True if the passwords match, false otherwise.
   */
  async validateHashMatch(
    hashValidationDto: HashValidationDto,
  ): Promise<boolean> {
    const { unhashedValue, hashedValue } = hashValidationDto;

    return await bcrypt.compare(unhashedValue, hashedValue);
  }

  /**
   * Generates a cryptographically secure random token as a hexadecimal string.
   *
   * @returns {string} A securely generated random token in hexadecimal format.
   */
  generateSecureToken(): string {
    return randomBytes(this.TOKEN_BYTES).toString("hex");
  }

  /**
   * Generates an unsalted hash from a raw string value using the configured hash algorithm.
   *
   * @param rawValue - The raw string value to be hashed
   * @returns A hexadecimal string representation of the hash
   *
   * @remarks
   * This method uses the hash algorithm specified in the environment configuration.
   * Since this is an unsalted hash, identical input values will always produce
   * identical hash outputs, making it suitable for deterministic hashing scenarios
   * but potentially vulnerable to rainbow table attacks.
   *
   * @example
   * ```typescript
   * const hash = cryptoService.generateUnsaltedHash('myPassword');
   * console.log(hash); // e.g., "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
   * ```
   */
  generateUnsaltedHash(rawValue: string): string {
    return createHash(envConfig.crypto.hash_algorithm)
      .update(rawValue, "utf8")
      .digest("hex");
  }
}
