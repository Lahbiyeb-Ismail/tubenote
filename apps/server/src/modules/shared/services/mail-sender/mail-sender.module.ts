import transporter from "./mail-sender.config";

import { MailSenderService } from "./mail-sender.service";

export const mailSenderService = new MailSenderService(transporter);
