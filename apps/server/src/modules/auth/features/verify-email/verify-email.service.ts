import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError } from "@/errors";

import logger from "@/utils/logger";
import { stringToDate } from "@utils/convert-string-to-date";

import type { IJwtService } from "@modules/auth/utils/services/jwt/jwt.types";
import type { IUserService } from "@modules/user";

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
    const user = await this._userService.getUser({ email });

    if (user.isEmailVerified) {
      throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this._verifyEmailRepository.findActiveToken({ userId: user.id });

    if (existingVerificationToken) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const expiresIn = VERIFY_EMAIL_TOKEN_EXPIRES_IN;

    const token = this._jwtService.sign({
      userId: user.id,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
      expiresIn,
    });

    await this._verifyEmailRepository.createToken({
      userId: user.id,
      data: {
        token,
        expiresAt: stringToDate(expiresIn),
      },
    });

    logger.info(`Verification email token generated for user ${user.id}`);

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const payload = await this._jwtService.verify({
      token,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
    });

    const foundToken = await this._verifyEmailRepository.findActiveToken({
      token,
    });

    if (!foundToken) {
      logger.warn(`Token reuse attempt for user ${payload.userId}`);

      await this._verifyEmailRepository.deleteMany(payload.userId);
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Deletes the email verification token from the database.
    await this._verifyEmailRepository.deleteMany(foundToken.userId);

    const verifiedUser = await this._userService.verifyUserEmail(
      foundToken.userId
    );

    logger.info(`Email verification successful for user ${verifiedUser.id}`);
  }
}
