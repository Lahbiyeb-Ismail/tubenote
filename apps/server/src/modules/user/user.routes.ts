import { Router } from "express";

import { updatePasswordSchema, updateUserSchema } from "@tubenote/schemas";

import {
  createCsrfMiddleware,
  createRateLimitMiddleware,
  isAuthenticated,
  validateRequest,
} from "@/middlewares";

import { SECURE_CSRF_CONFIG } from "@/modules/shared/config/csrf.config";
import { USER_RATE_LIMIT_CONFIG } from "./config";
import { userController } from "./user.module";

const userRoutes = Router();

const updatePasswordRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `updatePassword:userId:${req.userId}`,
  rateLimitConfig: USER_RATE_LIMIT_CONFIG.updatePassword,
});

// Enhanced CSRF protection for sensitive routes
const secureActionCsrfProtection = createCsrfMiddleware(SECURE_CSRF_CONFIG);

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
userRoutes.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
userRoutes
  .route("/me")
  .get((req, res) => userController.getCurrentUser(req, res))
  .patch(validateRequest({ body: updateUserSchema }), (req, res) =>
    userController.updateCurrentUser(req, res)
  );

// - PATCH /update-password: Update the current user's password (requires request body validation)
// Apply enhanced CSRF protection with token rotation for this sensitive route
userRoutes.route("/update-password").patch(
  secureActionCsrfProtection, // Enhanced CSRF protection with token rotation
  updatePasswordRateLimiter,
  validateRequest({ body: updatePasswordSchema }),
  (req, res) => userController.updatePassword(req, res)
);

export { userRoutes };
