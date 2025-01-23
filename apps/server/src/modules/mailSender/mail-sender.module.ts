import transporter from "@config/node-mailer.config";

import { MailSenderService } from "./mail-sender.service";

export const mailSenderService = new MailSenderService(transporter);
