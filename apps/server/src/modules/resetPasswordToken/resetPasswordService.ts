import UserDB from "../user/userDB";
import ResetPasswordDB from "./resetPasswordDB";

import EmailService from "../../services/emailService";
import AuthService from "../auth/authService";
import UserService from "../user/userService";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ForbiddenError, NotFoundError } from "../../errors";
import type { ResetTokenEntry } from "./resetPassword.type";

class ResetPasswordService {
  async sendResetToken(email: string): Promise<void> {
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isResetTokenAlreadySent = await ResetPasswordDB.findByUserId(user.id);

    if (isResetTokenAlreadySent) {
      throw new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT);
    }

    const token = await this.createToken(user.id);

    await EmailService.sendResetPasswordEmail({
      email: user.email,
      token,
    });
  }

  async createToken(userId: string): Promise<string> {
    const token = await ResetPasswordDB.create(userId);

    return token;
  }

  async reset(token: string, password: string): Promise<void> {
    const resetToken = await this.verifyResetToken(token);

    if (!resetToken) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const hashedPassword = await AuthService.hashPassword(password);

    await UserDB.update({
      userId: resetToken.userId,
      data: { password: hashedPassword },
    });

    await ResetPasswordDB.deleteMany(resetToken.userId);
  }

  async verifyResetToken(token: string): Promise<ResetTokenEntry | null> {
    const resetToken = await ResetPasswordDB.findByToken(token);

    if (!resetToken) {
      return null;
    }

    if (resetToken.expiresAt < new Date()) {
      await ResetPasswordDB.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return resetToken;
  }
}

export default new ResetPasswordService();
