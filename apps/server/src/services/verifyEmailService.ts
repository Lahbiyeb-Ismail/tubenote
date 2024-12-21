import type { EmailVerificationToken } from "@prisma/client";

import verificationTokenDB, {
  type IFindToken,
} from "../databases/verificationTokenDB";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ForbiddenError } from "../errors";

import authService from "./authService";
import emailService from "./emailService";
import userService from "./userService";

class EmailVerificationService {
  private async createToken(userId: string): Promise<string> {
    const token = await verificationTokenDB.create(userId);

    return token;
  }

  private async findVerificationToken({
    where,
  }: IFindToken): Promise<EmailVerificationToken | null> {
    const token = await verificationTokenDB.find({ where });

    return token;
  }

  async generateAndSendToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken = await this.findVerificationToken({
      where: { userId: user.id },
    });

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const newToken = await this.createToken(user.id);

    await emailService.sendVerificationEmail({ email, token: newToken });
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this.findVerificationToken({ where: { token } });

    if (!foundToken || foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await authService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await verificationTokenDB.deleteMany({
      where: { userId: foundToken.userId },
    });
  }
}

export default new EmailVerificationService();
