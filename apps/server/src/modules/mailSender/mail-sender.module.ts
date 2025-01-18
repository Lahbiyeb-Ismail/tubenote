import transporter from "../../config/node-mailer.config";
import { resetPasswordService } from "../auth/reset-password/reset-password.module";
import { verifyEmailService } from "../auth/verify-email/verify-email.module";
import { MailSenderService } from "./mail-sender.service";

import type { IMailSenderService } from "./mail-sender.types";

export const mailSenderService: IMailSenderService = new MailSenderService(
  transporter,
  verifyEmailService,
  resetPasswordService
);
