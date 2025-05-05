import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import { BadRequestError, ForbiddenError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { stringToDate } from "@/modules/shared/utils";

import type { ILoggerService, IPrismaService } from "@/modules/shared/services";

import type { IUserService } from "@/modules/user";

import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/modules/auth/constants";
import type { IJwtService } from "@/modules/auth/utils";

import { TYPES } from "@/config/inversify/types";

import type {
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "./verify-email.types";

@injectable()
export class VerifyEmailService implements IVerifyEmailService {
  constructor(
    @inject(TYPES.VerifyEmailRepository)
    private readonly _verifyEmailRepository: IVerifyEmailRepository,
    @inject(TYPES.PrismaService)
    private readonly _prismaService: IPrismaService,
    @inject(TYPES.UserService) private readonly _userService: IUserService,
    @inject(TYPES.JwtService) private readonly _jwtService: IJwtService,
    @inject(TYPES.LoggerService) private readonly _loggerService: ILoggerService
  ) {}

  async createToken(
    tx: Prisma.TransactionClient,
    email: string
  ): Promise<string> {
    const user = await this._userService.getUserByEmail(email, tx);

    if (!user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (user.isEmailVerified) {
      throw new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
    }

    const existingVerificationToken =
      await this._verifyEmailRepository.findByUserId(user.id, tx);

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
      user.id,
      {
        token,
        expiresAt: stringToDate(expiresIn),
      },
      tx
    );

    this._loggerService.info(
      `Verification email token generated for user ${user.id}`
    );

    return token;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const { jwtPayload, error } = this._jwtService.verify({
      token,
      secret: VERIFY_EMAIL_TOKEN_SECRET,
    });

    if (jwtPayload) {
      await this._prismaService.transaction(async (tx) => {
        const foundToken = await this._verifyEmailRepository.findByToken(
          token,
          tx
        );

        if (!foundToken) {
          this._loggerService.warn(
            `Token reuse attempt for user ${jwtPayload.userId}`
          );

          await this._verifyEmailRepository.deleteMany(jwtPayload.userId, tx);
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
    } else {
      throw error;
    }
  }
}
