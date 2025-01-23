import { ForbiddenError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { IJwtService } from "@modules/auth/core/services/jwt/jwt.types";
import type { IUserService } from "@modules/user/user.types";

import envConfig from "@/config/env.config";
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

    const expiresIn = envConfig.jwt.verify_email_token.expire;

    const token = this._jwtService.sign({
      userId: user.id,
      secret: envConfig.jwt.verify_email_token.secret,
      expiresIn,
    });

    await this._verifyEmailRepository.saveToken(user.id, token, expiresIn);

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const foundToken = await this._verifyEmailRepository.findByToken(token);

    if (!foundToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (foundToken.expiresAt < new Date()) {
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    // Updates the user's isEmailVerified status to true.
    await this._userService.updateUser(foundToken.userId, {
      isEmailVerified: true,
    });
    // Deletes the email verification token from the database.
    await this._verifyEmailRepository.deleteMany(foundToken.userId);
  }
}
