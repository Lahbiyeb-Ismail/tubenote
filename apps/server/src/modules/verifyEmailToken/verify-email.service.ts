import { ERROR_MESSAGES } from "../../constants/error-messages.contants";
import { ForbiddenError } from "../../errors";

import type { IAuthService } from "../auth/auth.types";
import type { IUserService } from "../user/user.types";
import type {
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "./verify-email.types";

export class VerifyEmailService implements IVerifyEmailService {
  constructor(
    private readonly _verifyEmailRepository: IVerifyEmailRepository,
    private readonly _userService: IUserService,
    private readonly _authService: IAuthService
  ) {}

  async generateToken(email: string): Promise<string> {
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this._verifyEmailRepository.findByUserId(user.id);

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const verificationToken = await this._verifyEmailRepository.create(user.id);

    return verificationToken;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this._verifyEmailRepository.findByToken(token);

    if (!foundToken) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await this._authService.verifyEmail(foundToken.userId);
    // Deletes the email verification token from the database.
    await this._verifyEmailRepository.deleteMany(foundToken.userId);
  }
}
