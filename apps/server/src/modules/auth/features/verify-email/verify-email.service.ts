import type { Prisma } from "@prisma/client";

import { BadRequestError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { stringToDate } from "@/modules/shared/utils";

import type { ILoggerService, IPrismaService } from "@/modules/shared/services";

import type { IUserService } from "@/modules/user";

import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/modules/auth/constants";
import type { IJwtService } from "@/modules/auth/utils";

import type {
  IVerifyEmailRepository,
  IVerifyEmailService,
  IVerifyEmailServiceOptions,
} from "./verify-email.types";

export class VerifyEmailService implements IVerifyEmailService {
  private static instance: VerifyEmailService;

  constructor(
    private readonly _verifyEmailRepository: IVerifyEmailRepository,
    private readonly _prismaService: IPrismaService,
    private readonly _userService: IUserService,
    private readonly _jwtService: IJwtService,
    private readonly _loggerService: ILoggerService
  ) {}

  static getInstance(options: IVerifyEmailServiceOptions): VerifyEmailService {
    if (!this.instance) {
      this.instance = new VerifyEmailService(
        options.verifyEmailRepository,
        options.prismaService,
        options.userService,
        options.jwtService,
        options.loggerService
      );
    }
    return this.instance;
  }

  async createToken(
    tx: Prisma.TransactionClient,
    email: string
  ): Promise<string> {
    const user = await this._userService.getUserByIdOrEmail({ email }, tx);

    if (user.isEmailVerified) {
      throw new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this._verifyEmailRepository.findActiveToken(
        { userId: user.id },
        tx
      );

    if (existingVerificationToken) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION_LINK_SENT);
    }

    const expiresIn = VERIFY_EMAIL_TOKEN_EXPIRES_IN;

    const token = this._jwtService.sign({
      userId: user.id,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
      expiresIn,
    });

    await this._verifyEmailRepository.createToken(
      {
        userId: user.id,
        data: {
          token,
          expiresAt: stringToDate(expiresIn),
        },
      },
      tx
    );

    this._loggerService.info(
      `Verification email token generated for user ${user.id}`
    );

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const payload = await this._jwtService.verify({
      token,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
    });

    await this._prismaService.transaction(async (tx) => {
      const foundToken = await this._verifyEmailRepository.findActiveToken(
        {
          token,
        },
        tx
      );

      if (!foundToken) {
        this._loggerService.warn(
          `Token reuse attempt for user ${payload.userId}`
        );

        await this._verifyEmailRepository.deleteMany(payload.userId, tx);
        throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
      }

      // Deletes the email verification token from the database.
      await this._verifyEmailRepository.deleteMany(foundToken.userId, tx);

      const verifiedUser = await this._userService.verifyUserEmail(
        foundToken.userId,
        tx
      );

      this._loggerService.info(
        `Email verification successful for user ${verifiedUser.id}`
      );
    });
  }
}
