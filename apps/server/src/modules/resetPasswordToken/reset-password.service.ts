import { ERROR_MESSAGES } from "../../constants/error-messages.contants";
import { ForbiddenError, NotFoundError } from "../../errors";

import type { ResetPasswordToken } from "./reset-password.model";

import type { IMailSenderService } from "../mailSender/mail-sender.types";
import type { IPasswordHasherService } from "../password-hasher/password-hasher.types";
import type { IUserService } from "../user/user.types";
import type {
  IResetPasswordRespository,
  IResetPasswordService,
} from "./reset-password.types";

export class ResetPasswordService implements IResetPasswordService {
  constructor(
    private readonly _resetPasswordRepository: IResetPasswordRespository,
    private readonly _userService: IUserService,
    private readonly _passwordHasherService: IPasswordHasherService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async sendResetToken(email: string): Promise<void> {
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isResetTokenAlreadySent =
      await this._resetPasswordRepository.findByUserId(user.id);

    if (isResetTokenAlreadySent) {
      throw new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT);
    }

    await this._mailSenderService.sendResetPasswordEmail(user.email);
  }

  async createToken(userId: string): Promise<string> {
    const token = await this._resetPasswordRepository.create(userId);

    return token;
  }

  async reset(token: string, _password: string): Promise<void> {
    const resetToken = await this.findResetToken(token);

    if (!resetToken) throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);

    const isTokenExpired = await this.isResetTokenExpired(resetToken);

    if (isTokenExpired) {
      await this._resetPasswordRepository.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    // await this._passwordHasherService.resetPassword({
    //   userId: resetToken.userId,
    //   password,
    // });

    // await this._resetPasswordRepository.deleteMany(resetToken.userId);
  }

  async findResetToken(token: string): Promise<ResetPasswordToken | null> {
    const resetToken = await this._resetPasswordRepository.findByToken(token);

    if (!resetToken) {
      return null;
    }

    return resetToken;
  }

  async isResetTokenExpired(resetToken: ResetPasswordToken): Promise<boolean> {
    if (resetToken.expiresAt < new Date()) {
      return true;
    }

    return false;
  }

  async verifyResetToken(token: string): Promise<ResetPasswordToken> {
    const resetToken = await this.findResetToken(token);

    if (!resetToken) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const isTokenExpired = await this.isResetTokenExpired(resetToken);

    if (isTokenExpired) {
      await this._resetPasswordRepository.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    return resetToken;
  }
}
