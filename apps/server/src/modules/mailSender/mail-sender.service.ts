import type { Transporter } from "nodemailer";

import envConfig from "../../config/env.config";

import compileTemplate from "../../utils/compile-template";
import logger from "../../utils/logger";

import { ERROR_MESSAGES } from "../../constants/error-messages.contants";
import { BadRequestError } from "../../errors";

import type { IVerifyEmailService } from "../../modules/verifyEmailToken/verify-email.types";
import type { IResetPasswordService } from "../resetPasswordToken/reset-password.types";
import type { SendMailDto } from "./dtos/send-mail.dto";
import type { EmailContent, IMailSenderService } from "./mail-sender.types";

export class MailSenderService implements IMailSenderService {
  constructor(
    private readonly _transporter: Transporter,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _resetPasswordService: IResetPasswordService
  ) {}

  async sendMail(sendMailDto: SendMailDto): Promise<void> {
    const mailOptions = {
      from: envConfig.email.from,
      to: sendMailDto.emailRecipient,
      subject: sendMailDto.emailSubject,
      html: sendMailDto.htmlContent,
      text: sendMailDto.textContent,
      attachments: [
        {
          filename: "logo.png",
          path: sendMailDto.logoPath,
          cid: "logo",
        },
      ],
    };

    this._transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Error sending email - ${error.name}: ${error.message}`);
        throw new BadRequestError(ERROR_MESSAGES.MAIL_SENDING_FAILED);
      } else {
        logger.info(`Verify email sent: ${info.response}`);
      }
    });
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const token = await this._verifyEmailService.generateToken(email);

    const { htmlContent, logoPath, textContent } =
      await this.buildVerificationEmail(token);

    await this.sendMail({
      emailRecipient: email,
      emailSubject: "Verify your email",
      htmlContent,
      textContent,
      logoPath,
    });
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    const token = await this._resetPasswordService.createToken(email);

    const { htmlContent, logoPath, textContent } =
      await this.buildResetPasswordEmail(token);

    await this.sendMail({
      emailRecipient: email,
      emailSubject: "Reset Password",
      htmlContent,
      textContent,
      logoPath,
    });
  }

  private async buildVerificationEmail(token: string): Promise<EmailContent> {
    const verificationLink = `${envConfig.server.url}/api/v1/verify-email/${token}`;
    return compileTemplate("verification-email", { verificationLink });
  }

  private async buildResetPasswordEmail(token: string): Promise<EmailContent> {
    const resetLink = `${envConfig.client.url}/password-reset/${token}`;

    return compileTemplate("reset-password", { resetLink });
  }
}
