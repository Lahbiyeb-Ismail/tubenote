import type { SendMailDto } from "./dtos/send-mail.dto";

export interface IMailSenderService {
  sendMail(sendMailDto: SendMailDto): Promise<void>;
  sendVerificationEmail(email: string, verifyEmailToken: string): Promise<void>;
  sendResetPasswordEmail(
    email: string,
    resetPasswordToken: string
  ): Promise<void>;
}

export type EmailContent = {
  htmlContent: string;
  textContent: string;
  logoPath: string;
};
