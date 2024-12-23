import nodemailer, { type Transporter } from "nodemailer";

import type { EmailContent } from "../types/email.type";

import envConfig from "../config/envConfig";
import compileTemplate from "../utils/compileTemplate";
import logger from "../utils/logger";

/**
 * This function sends an email to the given email with the email verification link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The email verification token
 */

interface ISendEmailProps {
  emailRecipient: string;
  emailSubject: string;
  htmlContent: string;
  textContent: string;
  logoPath: string;
}

interface ISendEmail {
  email: string;
  token: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envConfig.email.smtp.host,
      port: +envConfig.email.smtp.port,
      secure: true, // use TLS
      auth: {
        user: envConfig.email.smtp.auth.user,
        pass: envConfig.email.smtp.auth.password,
      },
    });
  }

  async sendEmail({
    emailRecipient,
    emailSubject,
    htmlContent,
    textContent,
    logoPath,
  }: ISendEmailProps) {
    const mailOptions = {
      from: envConfig.email.from,
      to: emailRecipient,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
      ],
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Error sending email - ${error.name}: ${error.message}`);
      } else {
        logger.info(`Verify email sent: ${info.response}`);
      }
    });
  }

  async sendVerificationEmail({ email, token }: ISendEmail): Promise<void> {
    const { htmlContent, logoPath, textContent } =
      await this.buildVerificationEmail(token);

    await this.sendEmail({
      emailRecipient: email,
      emailSubject: "Verify your email",
      htmlContent,
      textContent,
      logoPath,
    });
  }

  async sendResetPasswordEmail({ email, token }: ISendEmail): Promise<void> {
    const { htmlContent, logoPath, textContent } =
      await this.buildResetPasswordEmail(token);

    await this.sendEmail({
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

export default new EmailService();
