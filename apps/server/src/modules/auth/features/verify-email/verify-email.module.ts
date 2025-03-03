import { prismaClient } from "@/modules/shared/config";
import { loggerService } from "@/modules/shared/services";

import { userService } from "@/modules/user";

import { jwtService } from "../../utils";

import { VerifyEmailController } from "./verify-email.controller";
import { VerifyEmailRepository } from "./verify-email.repository";
import { VerifyEmailService } from "./verify-email.service";

const verifyEmailRepository = new VerifyEmailRepository(prismaClient);
const verifyEmailService = new VerifyEmailService(
  verifyEmailRepository,
  userService,
  jwtService,
  loggerService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

export { verifyEmailController, verifyEmailService };
