import prismaClient from "@config/database.config";

import { jwtService } from "@modules/auth/utils/services/jwt/jwt.module";
import { userService } from "@modules/user";

import { VerifyEmailController } from "./verify-email.controller";
import { VerifyEmailRepository } from "./verify-email.repository";
import { VerifyEmailService } from "./verify-email.service";

const verifyEmailRepository = new VerifyEmailRepository(prismaClient);
const verifyEmailService = new VerifyEmailService(
  verifyEmailRepository,
  userService,
  jwtService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

export { verifyEmailController, verifyEmailService };
