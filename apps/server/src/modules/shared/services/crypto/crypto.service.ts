import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";

import type { ICryptoService } from "./crypto.types";
import type { ComparePasswordDto } from "./dtos";

export class CryptoService implements ICryptoService {
  private readonly SALT_ROUNDS = 12;
  private readonly TOKEN_BYTES = 32;

  /**
   * Hashes a plain-text password.
   * @param password - The plain-text password to hash.
   * @returns The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error("Password is required for hashing.");
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);

    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain-text password with a hashed password.
   * @param password - The plain-text password.
   * @param hashedPassword - The hashed password to compare with.
   * @returns True if the passwords match, false otherwise.
   */
  async comparePasswords(
    comparePasswordDto: ComparePasswordDto
  ): Promise<boolean> {
    const { plainText, hash } = comparePasswordDto;

    if (!plainText || !hash) {
      throw new Error(
        "Both plainText and hashed passwords are required for comparison."
      );
    }
    return await bcrypt.compare(plainText, hash);
  }

  generateRandomSecureToken(): string {
    return randomBytes(this.TOKEN_BYTES).toString("hex");
  }

  async hashToken(token: string): Promise<string> {
    return createHash("sha256").update(token).digest("hex");
  }
}
