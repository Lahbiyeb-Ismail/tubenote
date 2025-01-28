import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { ResetPasswordToken } from "./reset-password.model";

import {
  RESET_PASSWORD_TOKEN_EXPIRES_IN,
  RESET_PASSWORD_TOKEN_SECRET,
} from "@/constants/auth.contants";
import { stringToDate } from "@/utils/convert-string-to-date";
import type { IJwtService } from "@modules/auth/utils/services/jwt/jwt.types";
import type { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import type { IUserService } from "@modules/user/user.types";
import type {
  IResetPasswordRepository,
  IResetPasswordService,
} from "./reset-password.types";

export class ResetPasswordService implements IResetPasswordService {
  constructor(
    private readonly _resetPasswordRepository: IResetPasswordRepository,
    private readonly _userService: IUserService,
    private readonly _jwtService: IJwtService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async sendResetToken(email: string): Promise<void> {
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isResetTokenAlreadySent =
      await this._resetPasswordRepository.findByUserId(user.id);

    if (isResetTokenAlreadySent) {
      throw new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT);
    }

    const expiresIn = RESET_PASSWORD_TOKEN_EXPIRES_IN;

    const token = this._jwtService.sign({
      userId: user.id,
      secret: RESET_PASSWORD_TOKEN_SECRET,
      expiresIn,
    });

    await this._resetPasswordRepository.saveToken({
      userId: user.id,
      token,
      expiresAt: stringToDate(expiresIn),
    });

    await this._mailSenderService.sendResetPasswordEmail(user.email, token);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const resetToken = await this.verifyResetToken(token);

    await this._userService.resetPassword(resetToken.userId, password);

    await this._resetPasswordRepository.deleteMany(resetToken.userId);
  }

  async verifyResetToken(token: string): Promise<ResetPasswordToken> {
    const decocedToken = await this._jwtService.verify({
      token,
      secret: RESET_PASSWORD_TOKEN_SECRET,
    });

    const user = await this._userService.getUserById(decocedToken.userId);

    if (!user) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const resetToken = await this._resetPasswordRepository.findByToken(token);

    if (!resetToken) {
      await this._resetPasswordRepository.deleteMany(user.id);
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return resetToken;
  }
}
