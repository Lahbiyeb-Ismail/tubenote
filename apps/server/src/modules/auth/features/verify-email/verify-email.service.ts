import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";

import { stringToDate } from "@utils/convert-string-to-date";

import type { IJwtService } from "@modules/auth/utils/services/jwt/jwt.types";
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

    const expiresIn = VERIFY_EMAIL_TOKEN_EXPIRES_IN;

    const token = this._jwtService.sign({
      userId: user.id,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
      expiresIn,
    });

    await this._verifyEmailRepository.saveToken({
      userId: user.id,
      token,
      expiresAt: stringToDate(expiresIn),
    });

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const payload = await this._jwtService.verify({
      token,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
    });

    const user = await this._userService.getUserById(payload.userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const foundToken = await this._verifyEmailRepository.findByToken(token);

    if (!foundToken) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await this._userService.updateUser(foundToken.userId, {
      isEmailVerified: true,
    });
    // Deletes the email verification token from the database.
    await this._verifyEmailRepository.deleteMany(foundToken.userId);
  }
}
