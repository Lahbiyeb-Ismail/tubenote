import bcrypt from 'bcryptjs';

import type { User } from '@prisma/client';
import prismaClient from '../lib/prismaDB';

/**
 * Checks if a user with the given email exists.
 * @param email - The email of the user to check.
 * @returns The user object if found, otherwise undefined.
 */
export const userExists = async (email: string): Promise<User | null> => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

interface UserCredentials {
  username: string;
  email: string;
  password: string;
}

export const createNewUser = async (
  userCredentials: UserCredentials,
): Promise<User> => {
  const { username, email, password } = userCredentials;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};
