import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { refreshTokenService } from "./features";

const authService = AuthService.getInstance({ refreshTokenService });

const authController = AuthController.getInstance({ authService });

export { authController, authService };
