import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prismaClient from '../lib/prisma';
import type { RegisterCredentiels } from '../types/auth.type';

/**
 * Checks if a user exists in the database by their email.
 *
 * @param email - The email of the user to check.
 * @returns A promise that resolves to the user object if found, otherwise null.
 */
export async function isUserExist(email: string): Promise<User | null> {
  const user = await prismaClient.user.findUnique({ where: { email } });

  return user;
}

/**
 * Creates a new user with the provided registration credentials.
 *
 * @param registerCredentiels - An object containing the user's registration credentials.
 * @param registerCredentiels.username - The username of the new user.
 * @param registerCredentiels.email - The email address of the new user.
 * @param registerCredentiels.password - The password of the new user.
 * @returns A promise that resolves to the newly created user.
 */
export async function createNewUser(
  registerCredentiels: RegisterCredentiels
): Promise<User> {
  const { username, email, password } = registerCredentiels;

  const hashedpassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username: username,
      email: email,
      password: hashedpassword,
    },
  });

  return newUser;
}
