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

export async function createEmailVericationToken(userId: string) {
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
