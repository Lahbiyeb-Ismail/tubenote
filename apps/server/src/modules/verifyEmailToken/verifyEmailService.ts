import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ForbiddenError } from "../../errors";

import VerificationTokenDB from "./verificationTokenDB";

import EmailService from "../../services/emailService";
import AuthService from "../auth/authService";
import UserService from "../user/userService";

class EmailVerificationService {
  private async createToken(userId: string): Promise<string> {
    const token = await VerificationTokenDB.create(userId);

    return token;
  }

  async generateAndSendToken(email: string): Promise<void> {
    const user = await UserService.getUserByEmail(email);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken = await VerificationTokenDB.findByUserId(
      user.id
    );

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const newToken = await this.createToken(user.id);

    await EmailService.sendVerificationEmail({ email, token: newToken });
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await VerificationTokenDB.findByToken(token);

    if (!foundToken || foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await AuthService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await VerificationTokenDB.deleteMany(foundToken.userId);
  }
}

export default new EmailVerificationService();
