import bcrypt from 'bcryptjs';
import type { Prisma, User } from '@prisma/client';

import prismaClient from '../lib/prisma';

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

/**
 * Creates a new user in the database with the provided user data.
 * The user's password is hashed before being stored.
 *
 * @param {Prisma.UserCreateInput} userData - The data for the new user, including the password.
 * @returns {Promise<Prisma.User>} The newly created user.
 */
export async function createNewUser(
  userData: Prisma.UserCreateInput
): Promise<User> {
  const hashedpassword = await hashPassword(userData.password);

  const newUser = await prismaClient.user.create({
    data: {
      ...userData,
      password: hashedpassword,
    },
  });

  return newUser;
}
