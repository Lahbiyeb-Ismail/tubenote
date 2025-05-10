// Export the class definitions directly
export { VerifyEmailService } from "./verify-email.service";
export { VerifyEmailController } from "./verify-email.controller";
export { VerifyEmailRepository } from "./verify-email.repository";

// Re-export initialized service from service-provider
import {
  verifyEmailController,
  verifyEmailService,
} from "@/config/service-provider";
export { verifyEmailService, verifyEmailController };
