// Re-export initialized services from service-provider
import {
  localAuthController,
  localAuthService,
} from "@/config/service-provider";

export { localAuthService, localAuthController };
