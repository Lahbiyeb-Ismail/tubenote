import type { Transporter } from "nodemailer";

import { compileTemplate } from "@modules/shared";

import {
  BadRequestError,
  ERROR_MESSAGES,
  type ILoggerService,
  envConfig,
} from "@modules/shared";

import type { EmailContent, IMailSenderService, SendMailDto } from "./";

export class MailSenderService implements IMailSenderService {
  constructor(
    private readonly _transporter: Transporter,
    private readonly _loggerService: ILoggerService
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
        this._loggerService.error(
          `Error sending email - ${error.name}: ${error.message}`
        );
        throw new BadRequestError(ERROR_MESSAGES.MAIL_SENDING_FAILED);
      } else {
        this._loggerService.info(`Verify email sent: ${info.response}`);
      }
    });
  }

  async sendVerificationEmail(
    email: string,
    verifyEmailToken: string
  ): Promise<void> {
    const { htmlContent, logoPath, textContent } =
      await this.buildVerificationEmail(verifyEmailToken);

    await this.sendMail({
      emailRecipient: email,
      emailSubject: "Verify your email",
      htmlContent,
      textContent,
      logoPath,
    });
  }

  async sendResetPasswordEmail(
    email: string,
    resetPasswordToken: string
  ): Promise<void> {
    const { htmlContent, logoPath, textContent } =
      await this.buildResetPasswordEmail(resetPasswordToken);

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
