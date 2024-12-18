import resetPasswordDatabase from "../databases/resetPasswordDatabase";
import userDatabase from "../databases/userDatabase";
import { BadRequestError } from "../errors";
import authService from "./authService";
import emailService from "./emailService";
import userService from "./userService";

class ResetPasswordService {
  async sendResetToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (!user.emailVerified) {
      throw new BadRequestError("Invalid email or email not verified.");
    }

    const isResetTokenAlreadySent = await resetPasswordDatabase.find({
      id: user.id,
    });

    if (isResetTokenAlreadySent) {
      throw new BadRequestError(
        "A password reset link has already been sent to your email."
      );
    }

    const newResetToken = await resetPasswordDatabase.create(user.id);

    await emailService.sendResetPasswordEmail({
      email: user.email,
      token: newResetToken,
    });
  }

  async reset(token: string, password: string): Promise<void> {
    const userId = await this.verfiyResetToken(token);

    const hashedPassword = await authService.hashPassword(password);

    await userDatabase.updateUser({
      userId,
      data: { password: hashedPassword },
    });

    await resetPasswordDatabase.deleteMany(userId);
  }

  async verfiyResetToken(token: string): Promise<string> {
    const resetToken = await resetPasswordDatabase.find({ token });

    if (!resetToken) {
      throw new BadRequestError("Invalid reset token.");
    }

    if (resetToken.expiresAt < new Date()) {
      await resetPasswordDatabase.deleteMany(resetToken.userId);
      throw new BadRequestError("Reset token has expired.");
    }

    return resetToken.userId;
  }
}

export default new ResetPasswordService();
