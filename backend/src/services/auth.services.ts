import bcrypt from 'bcryptjs';

/**
 * Hashes a given password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
}
