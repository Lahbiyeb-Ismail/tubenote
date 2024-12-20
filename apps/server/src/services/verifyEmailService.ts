import type { EmailVerificationToken } from "@prisma/client";

import verificationTokenDatabase, {
  type IFindToken,
} from "../databases/verificationTokenDatabase";

import { ConflictError, ForbiddenError } from "../errors";

import authService from "./authService";
import emailService from "./emailService";
import userService from "./userService";

class EmailVerificationService {
  private async createToken(userId: string): Promise<string> {
    const token = await verificationTokenDatabase.create(userId);

    return token;
  }

  private async findVerificationToken({
    where,
  }: IFindToken): Promise<EmailVerificationToken | null> {
    const token = await verificationTokenDatabase.find({ where });

    return token;
  }

  async generateAndSendToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (user.isEmailVerified) {
      throw new ConflictError("Email is already verified.");
    }

    const existingVerificationToken = await this.findVerificationToken({
      where: { userId: user.id },
    });

    if (existingVerificationToken) {
      throw new ConflictError(
        "A verification email has already been sent. Please check your email."
      );
    }

    const newToken = await this.createToken(user.id);

    await emailService.sendVerificationEmail({ email, token: newToken });
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this.findVerificationToken({ where: { token } });

    if (!foundToken || foundToken.expiresAt < new Date()) {
      throw new ForbiddenError("Invalid or expired token.");
    }

    // Updates the user's isEmailVerified status to true.
    await authService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await verificationTokenDatabase.deleteMany({
      where: { userId: foundToken.userId },
    });
  }
}

export default new EmailVerificationService();
