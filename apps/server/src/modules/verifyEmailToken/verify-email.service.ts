import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ForbiddenError } from "../../errors";

import { IVerificationTokenDB } from "./verification-token.db";

import { IAuthService } from "../auth/auth.service";
import { IUserDatabase } from "../user/user.db";

export interface IVerifyEmailService {
  generateToken(email: string): Promise<string>;
  verifyUserEmail(token: string): Promise<void>;
}

export class VerifyEmailService implements IVerifyEmailService {
  private userDB: IUserDatabase;
  private verificationTokenDB: IVerificationTokenDB;
  private authService: IAuthService;

  constructor(
    userDB: IUserDatabase,
    verificationTokenDB: IVerificationTokenDB,
    authService: IAuthService
  ) {
    this.userDB = userDB;
    this.verificationTokenDB = verificationTokenDB;
    this.authService = authService;
  }

  async generateToken(email: string): Promise<string> {
    const user = await this.userDB.findByEmail(email);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this.verificationTokenDB.findByUserId(user.id);

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const verificationToken = await this.verificationTokenDB.create(user.id);

    return verificationToken;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this.verificationTokenDB.findByToken(token);

    if (!foundToken) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await this.authService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await this.verificationTokenDB.deleteMany(foundToken.userId);
  }
}
