import type { IUserService } from "@/modules/user";

import { BadRequestError, ForbiddenError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
} from "@/modules/shared/services";

import type {
  IResetPasswordService,
  IResetPasswordServiceOptions,
} from "./reset-password.types";

export class ResetPasswordService implements IResetPasswordService {
  private static instance: ResetPasswordService;

  constructor(
    private readonly _userService: IUserService,
    private readonly _cryptoService: ICryptoService,
    private readonly _cacheService: ICacheService,
    private readonly _mailSenderService: IMailSenderService,
    private readonly _loggerService: ILoggerService
  ) {}

  static getInstance(
    options: IResetPasswordServiceOptions
  ): ResetPasswordService {
    if (!this.instance) {
      this.instance = new ResetPasswordService(
        options.userService,
        options.cryptoService,
        options.cacheService,
        options.mailSenderService,
        options.loggerService
      );
    }

    return this.instance;
  }

  async sendResetToken(email: string): Promise<void> {
    const user = await this._userService.getUserByIdOrEmail({ email });

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.NOT_VERIFIED);
    }

    const resetToken = this._cryptoService.generateRandomSecureToken();

    const setResult = this._cacheService.set<{ userId: string }>(resetToken, {
      userId: user.id,
    });

    this._loggerService.info(
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
    this._loggerService.warn(
      `Remove reset token ${token} from cache: ${deleteResult}`
    );

    await this._userService.resetUserPassword({
      id: userId,
      newPassword: password,
    });

    this._loggerService.info(`Password reset for user ${userId}`);
  }

  async verifyResetToken(token: string): Promise<string> {
    const tokenData = this._cacheService.get<{ userId: string }>(token);

    if (
      !tokenData ||
      !tokenData.userId ||
      typeof tokenData.userId !== "string"
    ) {
      this._loggerService.error(`Invalid reset token: ${token}`);
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return tokenData.userId;
  }
}
