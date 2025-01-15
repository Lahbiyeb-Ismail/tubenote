import transporter from "../../config/nodemailer.config";
import { verifyEmailService } from "../verifyEmailToken/verify-email.module";
import { MailSenderService } from "./mail-sender.service";
import type { IMailSenderService } from "./mail-sender.types";

export const mailSenderService: IMailSenderService = new MailSenderService(
  transporter,
  verifyEmailService
);
