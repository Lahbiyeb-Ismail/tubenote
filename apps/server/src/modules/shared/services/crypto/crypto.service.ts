import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

import type { ICryptoService } from "./crypto.types";
import type { HashValidationDto } from "./dtos";

export class CryptoService implements ICryptoService {
  private static _instance: CryptoService;

  private readonly SALT_ROUNDS = 12;
  private readonly TOKEN_BYTES = 64;

  private constructor() {}

  public static getInstance(): CryptoService {
    if (!this._instance) {
      this._instance = new CryptoService();
    }
    return this._instance;
  }

  /**
   * Hashes a plain-text password.
   * @param password - The plain-text password to hash.
   * @returns The hashed password.
   */
  async generateHash(rawValue: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);

    return await bcrypt.hash(rawValue, salt);
  }

  /**
   * Compares a plain-text password with a hashed password.
   * @param password - The plain-text password.
   * @param hashedPassword - The hashed password to compare with.
   * @returns True if the passwords match, false otherwise.
   */
  async validateHashMatch(
    hashValidationDto: HashValidationDto
  ): Promise<boolean> {
    const { unhashedValue, hashedValue } = hashValidationDto;

    return await bcrypt.compare(unhashedValue, hashedValue);
  }

  generateSecureToken(): string {
    return randomBytes(this.TOKEN_BYTES).toString("hex");
  }
}
