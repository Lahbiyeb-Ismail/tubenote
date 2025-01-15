import type { SendMailDto } from "./dtos/send-mail.dto";

export interface IMailSenderService {
  sendMail(sendMailDto: SendMailDto): Promise<void>;
  sendVerificationEmail(email: string): Promise<void>;
  sendResetPasswordEmail(email: string): Promise<void>;
}
