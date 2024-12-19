import nodemailer, { type Transporter } from "nodemailer";
import envConfig from "../config/envConfig";
import resetPasswordDatabase from "../databases/resetPasswordDatabase";
import { createResetPasswordEmail } from "../helpers/resetPassword.helper";
import { createVerificationEmail } from "../helpers/verifyEmail.helper";
import verificationTokenService from "./verificationTokenService";

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
  userId: string;
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

    await this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info(`Verify email sent: ${info.response}`);
      }
    });
  }

  async sendVerificationEmail({ email, userId }: ISendEmail): Promise<void> {
    const token =
      await verificationTokenService.createEmailVericationToken(userId);

    const { htmlContent, logoPath, textContent } =
      await createVerificationEmail(token);

    await this.sendEmail({
      emailRecipient: email,
      emailSubject: "Verify your email",
      htmlContent,
      textContent,
      logoPath,
    });
  }

  async sendResetPasswordEmail({ email, userId }: ISendEmail): Promise<void> {
    const token = await resetPasswordDatabase.create(userId);

    const { htmlContent, logoPath, textContent } =
      await createResetPasswordEmail(token);

    await this.sendEmail({
      emailRecipient: email,
      emailSubject: "Reset Password",
      htmlContent,
      textContent,
      logoPath,
    });
  }
}

export default new EmailService();
