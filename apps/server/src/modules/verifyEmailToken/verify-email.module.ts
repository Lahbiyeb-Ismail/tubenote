import prismaClient from "../../config/database.config";
import { authService } from "../auth/auth.module";
import { userService } from "../user/user.module";
import { VerifyEmailController } from "./verify-email.controller";
import { VerifyEmailRepository } from "./verify-email.repository";
import { VerifyEmailService } from "./verify-email.service";

const verifyEmailRepository = new VerifyEmailRepository(prismaClient);
const verifyEmailService = new VerifyEmailService(
  verifyEmailRepository,
  userService,
  authService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

export { verifyEmailController, verifyEmailService };
