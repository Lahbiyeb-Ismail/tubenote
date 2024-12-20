import resetPasswordDB from "../databases/resetPasswordDB";
import userDatabase from "../databases/userDB";

import authService from "./authService";
import emailService from "./emailService";
import userService from "./userService";

import { BadRequestError } from "../errors";

class ResetPasswordService {
  async sendResetToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (!user.isEmailVerified) {
      throw new BadRequestError("Invalid email or email not verified.");
    }

    const isResetTokenAlreadySent = await resetPasswordDB.find({
      id: user.id,
    });

    if (isResetTokenAlreadySent) {
      throw new BadRequestError(
        "A password reset link has already been sent to your email."
      );
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
      throw new BadRequestError("Invalid reset token.");
    }

    if (resetToken.expiresAt < new Date()) {
      await resetPasswordDB.deleteMany(resetToken.userId);
      throw new BadRequestError("Reset token has expired.");
    }

    return resetToken.userId;
  }
}

export default new ResetPasswordService();
