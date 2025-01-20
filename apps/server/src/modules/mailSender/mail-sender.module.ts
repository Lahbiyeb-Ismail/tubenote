import transporter from "@config/node-mailer.config";

import { MailSenderService } from "./mail-sender.service";

import { resetPasswordService } from "@modules/auth/features/reset-password/reset-password.module";
import { verifyEmailService } from "@modules/auth/features/verify-email/verify-email.module";

import type { IMailSenderService } from "./mail-sender.types";

export const mailSenderService: IMailSenderService = new MailSenderService(
  transporter,
  verifyEmailService,
  resetPasswordService
);
