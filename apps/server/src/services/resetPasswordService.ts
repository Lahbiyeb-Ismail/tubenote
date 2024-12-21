import resetPasswordDB from "../databases/resetPasswordDB";
import userDatabase from "../databases/userDB";

import authService from "./authService";
import emailService from "./emailService";
import userService from "./userService";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ForbiddenError, NotFoundError } from "../errors";

class ResetPasswordService {
  async sendResetToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isResetTokenAlreadySent = await resetPasswordDB.find({
      id: user.id,
    });

    if (isResetTokenAlreadySent) {
      throw new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT);
    }

    const token = await this.createToken(user.id);

    await emailService.sendResetPasswordEmail({
      email: user.email,
      token,
    });
  }

  async createToken(userId: string): Promise<string> {
    const token = await resetPasswordDB.create(userId);

    return token;
  }

  async reset(token: string, password: string): Promise<void> {
    const userId = await this.verfiyResetToken(token);

    const hashedPassword = await authService.hashPassword(password);

    await userDatabase.updateUser({
      userId,
      data: { password: hashedPassword },
    });

    await resetPasswordDB.deleteMany(userId);
  }

  async verfiyResetToken(token: string): Promise<string> {
    const resetToken = await resetPasswordDB.find({ token });

    if (!resetToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (resetToken.expiresAt < new Date()) {
      await resetPasswordDB.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.RESET_TOKEN_EXPIRED);
    }

    return resetToken.userId;
  }
}

export default new ResetPasswordService();
