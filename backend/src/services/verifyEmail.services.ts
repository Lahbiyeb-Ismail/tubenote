import { randomUUID } from 'node:crypto';
import prismaClient from '../lib/prisma';

export async function getEmailVericationToken(userId: string) {
  const verificationToken = await prismaClient.emailVerificationToken.findFirst(
    {
      where: {
        user: { id: userId },
        expiresAt: { gt: new Date() },
      },
    }
  );

  return verificationToken;
}

/**
 * Creates an email verification token for a given user.
 *
 * @param userId - The ID of the user for whom the email verification token is being created.
 * @returns A promise that resolves to the generated email verification token as a string.
 *
 * The token is generated using `randomUUID()` and is set to expire in 1 hour.
 * The token, expiration time, and user ID are stored in the `emailVerificationToken` table in the database.
 */
export async function createEmailVericationToken(
  userId: string
): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

  await prismaClient.emailVerificationToken.create({
    data: {
      token,
      expiresAt,
      userId,
    },
  });

  return token;
}

export async function deleteEmailVericationToken(userId: string) {
  await prismaClient.emailVerificationToken.deleteMany({
    where: { userId },
  });
}

export async function findVerificationToken(token: string) {
  const verificationToken =
    await prismaClient.emailVerificationToken.findUnique({
      where: { token },
    });

  return verificationToken;
}
