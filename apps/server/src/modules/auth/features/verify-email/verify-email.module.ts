import { loggerService, prismaService } from "@/modules/shared/services";

import { userService } from "@/modules/user";

import { jwtService } from "../../utils";

import { VerifyEmailController } from "./verify-email.controller";
import { VerifyEmailRepository } from "./verify-email.repository";
import { VerifyEmailService } from "./verify-email.service";

const verifyEmailRepository = VerifyEmailRepository.getInstance({
  db: prismaService,
});

const verifyEmailService = VerifyEmailService.getInstance({
  verifyEmailRepository,
  prismaService,
  userService,
  jwtService,
  loggerService,
});

const verifyEmailController = VerifyEmailController.getInstance({
  verifyEmailService,
});

export { verifyEmailController, verifyEmailService };
