import prismaClient from '../lib/prisma';

/**
 * Verifies the email of a user by updating the `emailVerified` field to `true`.
 *
 * @param userId - The unique identifier of the user whose email is to be verified.
 * @returns A promise that resolves when the user's email verification status has been updated.
 */
export async function verifyUserEmail(userId: string) {
  await prismaClient.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}
