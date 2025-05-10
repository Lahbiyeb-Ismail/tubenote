import { Router } from "express";

import { updatePasswordSchema, updateUserSchema } from "@tubenote/schemas";

import {
  createRateLimitMiddleware,
  isAuthenticated,
  validateRequest,
} from "@/middlewares";

import { USER_RATE_LIMIT_CONFIG } from "./config";
import { userController } from "./user.module";

const userRoutes = Router();

const updatePasswordRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `updatePassword:userId:${req.userId}`,
  rateLimitConfig: USER_RATE_LIMIT_CONFIG.updatePassword,
});

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
userRoutes
  .route("/update-password")
  .patch(
    updatePasswordRateLimiter,
    validateRequest({ body: updatePasswordSchema }),
    (req, res) => userController.updatePassword(req, res)
  );

export { userRoutes };
