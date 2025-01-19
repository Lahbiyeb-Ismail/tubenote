import bcrypt from "bcryptjs";

import type { ComparePasswordDto } from "./dtos/compare-password.dto";
import type { IPasswordHasherService } from "./password-hasher.types";

export class PasswordHasherService implements IPasswordHasherService {
  /**
   * Hashes a plain-text password.
   * @param password - The plain-text password to hash.
   * @returns The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error("Password is required for hashing.");
    }

    const salt = await bcrypt.genSalt(12);

    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain-text password with a hashed password.
   * @param password - The plain-text password.
   * @param hashedPassword - The hashed password to compare with.
   * @returns True if the passwords match, false otherwise.
   */
  async comparePassword(
    comparePasswordDto: ComparePasswordDto
  ): Promise<boolean> {
    const { password, hashedPassword } = comparePasswordDto;

    if (!password || !hashedPassword) {
      throw new Error(
        "Both password and hashed password are required for comparison."
      );
    }
    return await bcrypt.compare(password, hashedPassword);
  }
}
