import verificationTokenDB, {} from "../databases/verificationTokenDB";

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

  async generateAndSendToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken = await verificationTokenDB.findByUserId(
      user.id
    );

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const newToken = await this.createToken(user.id);

    await emailService.sendVerificationEmail({ email, token: newToken });
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await verificationTokenDB.findByToken(token);

    if (!foundToken || foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await authService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await verificationTokenDB.deleteMany(foundToken.userId);
  }
}

export default new EmailVerificationService();
