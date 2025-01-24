import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/constants/auth.contants";
import { ForbiddenError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import type { IUserService } from "@modules/user/user.types";

import type {
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "./verify-email.types";

export class VerifyEmailService implements IVerifyEmailService {
  constructor(
    private readonly _verifyEmailRepository: IVerifyEmailRepository,
    private readonly _userService: IUserService,
    private readonly _jwtService: IJwtService
  ) {}

  async generateToken(email: string): Promise<string> {
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this._verifyEmailRepository.findByUserId(user.id);

    if (existingVerificationToken) {
      throw new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const token = this._jwtService.sign({
      userId: user.id,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
      expiresIn: VERIFY_EMAIL_TOKEN_EXPIRES_IN,
    });

    await this._verifyEmailRepository.saveToken(user.id, token);

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this._verifyEmailRepository.findByToken(token);

    if (!foundToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    // TODO: Check if the token has expired.
    // if (foundToken.expiresAt < new Date()) {
    //   throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    // }

    // Updates the user's isEmailVerified status to true.
    await this._userService.updateUser(foundToken.userId, {
      isEmailVerified: true,
    });
    // Deletes the email verification token from the database.
    await this._verifyEmailRepository.deleteMany(foundToken.userId);
  }
}
