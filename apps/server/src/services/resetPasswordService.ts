import resetPasswordDatabase from "../databases/resetPasswordDatabase";
import { BadRequestError } from "../errors";
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
}

export default new ResetPasswordService();
