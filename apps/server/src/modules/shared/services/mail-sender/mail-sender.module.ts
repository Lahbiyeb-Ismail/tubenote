import transporter from "./mail-sender.config";

import { loggerService } from "../logger";

import { MailSenderService } from "./mail-sender.service";

export const mailSenderService = MailSenderService.getInstance({
  transporter,
  loggerService,
});
