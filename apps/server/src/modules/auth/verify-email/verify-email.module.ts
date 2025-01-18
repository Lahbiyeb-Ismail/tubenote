import prismaClient from "../../../config/database.config";

import { userService } from "../../user/user.module";

import { VerifyEmailController } from "./verify-email.controller";
import { VerifyEmailRepository } from "./verify-email.repository";
import { VerifyEmailService } from "./verify-email.service";

const verifyEmailRepository = new VerifyEmailRepository(prismaClient);
const verifyEmailService = new VerifyEmailService(
  verifyEmailRepository,
  userService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

export { verifyEmailController, verifyEmailService };
