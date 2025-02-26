import { ERROR_MESSAGES } from "@modules/shared";
import { BadRequestError, ForbiddenError } from "@modules/shared";

import logger from "@/utils/logger";

import type {
  ICacheService,
  ICryptoService,
  IMailSenderService,
} from "@modules/shared";
import type { IUserService } from "@modules/user";

import type { IResetPasswordService } from "./reset-password.types";

export class ResetPasswordService implements IResetPasswordService {
  constructor(
    private readonly _userService: IUserService,
    private readonly _cryptoService: ICryptoService,
    private readonly _cacheService: ICacheService,
    private readonly _mailSenderService: IMailSenderService
  ) {}

  async sendResetToken(email: string): Promise<void> {
    const user = await this._userService.getUser({ email });

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.NOT_VERIFIED);
    }

    const resetToken = this._cryptoService.generateRandomSecureToken();

    const setResult = this._cacheService.set<{ userId: string }>(resetToken, {
      userId: user.id,
    });

    logger.info(
      `Reset token generated for user ${user.id} and set in cache: ${setResult}`
    );

    await this._mailSenderService.sendResetPasswordEmail(
      user.email,
      resetToken
    );
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const userId = await this.verifyResetToken(token);

    const deleteResult = this._cacheService.del(token);
    logger.warn(`Remove reset token ${token} from cache: ${deleteResult}`);

    await this._userService.resetPassword({
      id: userId,
      newPassword: password,
    });

    logger.info(`Password reset for user ${userId}`);
  }

  async verifyResetToken(token: string): Promise<string> {
    const tokenData = this._cacheService.get<{ userId: string }>(token);

    if (
      !tokenData ||
      !tokenData.userId ||
      typeof tokenData.userId !== "string"
    ) {
      logger.error(`Invalid reset token: ${token}`);
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return tokenData.userId;
  }
}
