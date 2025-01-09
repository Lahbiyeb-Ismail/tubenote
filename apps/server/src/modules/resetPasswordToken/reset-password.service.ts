import { IPasswordService } from "../password/password.service";
import { IUserService } from "../user/user.service";
import { IResetPasswordTokenDatabase } from "./reset-password.db";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ForbiddenError, NotFoundError } from "../../errors";
import type { IEmailService } from "../../services/emailService";
import type { ResetTokenDto } from "./dtos/reset-token.dto";

export interface IResetPasswordService {
  sendResetToken(email: string): Promise<void>;
  createToken(userId: string): Promise<string>;
  reset(token: string, password: string): Promise<void>;
  findResetToken(token: string): Promise<ResetTokenDto | null>;
  isResetTokenExpired(resetToken: ResetTokenDto): Promise<boolean>;
  verifyResetToken(token: string): Promise<ResetTokenDto>;
}

export class ResetPasswordService implements IResetPasswordService {
  private resetTokenDB: IResetPasswordTokenDatabase;
  private userService: IUserService;
  private passwordService: IPasswordService;
  private emailService: IEmailService;

  constructor(
    resetTokenDB: IResetPasswordTokenDatabase,
    userService: IUserService,
    passwordService: IPasswordService,
    emailService: IEmailService
  ) {
    this.resetTokenDB = resetTokenDB;
    this.userService = userService;
    this.passwordService = passwordService;
    this.emailService = emailService;
  }

  async sendResetToken(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isResetTokenAlreadySent = await this.resetTokenDB.findByUserId(
      user.id
    );

    if (isResetTokenAlreadySent) {
      throw new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT);
    }

    const token = await this.createToken(user.id);

    await this.emailService.sendResetPasswordEmail({
      email: user.email,
      token,
    });
  }

  async createToken(userId: string): Promise<string> {
    const token = await this.resetTokenDB.create(userId);

    return token;
  }

  async reset(token: string, password: string): Promise<void> {
    const resetToken = await this.findResetToken(token);

    if (!resetToken) throw new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN);

    const isTokenExpired = await this.isResetTokenExpired(resetToken);

    if (isTokenExpired) {
      await this.resetTokenDB.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    await this.passwordService.resetPassword({
      userId: resetToken.userId,
      password,
    });

    await this.resetTokenDB.deleteMany(resetToken.userId);
  }

  async findResetToken(token: string): Promise<ResetTokenDto | null> {
    const resetToken = await this.resetTokenDB.findByToken(token);

    if (!resetToken) {
      return null;
    }

    return resetToken;
  }

  async isResetTokenExpired(resetToken: ResetTokenDto): Promise<boolean> {
    if (resetToken.expiresAt < new Date()) {
      return true;
    }

    return false;
  }

  async verifyResetToken(token: string): Promise<ResetTokenDto> {
    const resetToken = await this.findResetToken(token);

    if (!resetToken) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const isTokenExpired = await this.isResetTokenExpired(resetToken);

    if (isTokenExpired) {
      await this.resetTokenDB.deleteMany(resetToken.userId);
      throw new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    return resetToken;
  }
}
