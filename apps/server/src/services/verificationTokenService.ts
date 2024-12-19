import type { EmailVerificationToken } from "@prisma/client";
import verificationTokenDatabase, {
  type IFindToken,
} from "../databases/verificationTokenDatabase";
import { ConflictError, ForbiddenError, NotFoundError } from "../errors";
import emailService from "./emailService";
import userService from "./userService";

class VerificationTokenService {
  async createToken(userId: string): Promise<string> {
    const token = await verificationTokenDatabase.create(userId);

    return token;
  }

  async findVerificationToken({
    where,
  }: IFindToken): Promise<EmailVerificationToken> {
    const token = await verificationTokenDatabase.find({ where });

    if (!token) {
      throw new NotFoundError("No verification token found.");
    }

    return token;
  }

  async sendToken(email: string): Promise<void> {
    const user = await userService.getUserByEmail(email);

    if (user.emailVerified) {
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

  async verifyToken(token: string): Promise<void> {
    const validToken = await this.findVerificationToken({ where: { token } });

    if (!validToken || validToken.expiresAt < new Date()) {
      throw new ForbiddenError("Invalid or expired token.");
    }

    // Updates the user's emailVerified status to true.

    // Deletes the email verification token from the database.

    // Responds with a 200 OK status indicating that the email was verified successfully.
  }
}

export default new VerificationTokenService();
