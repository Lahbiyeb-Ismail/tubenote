import { updatePasswordSchema, updateUserSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { UserController } from "./user.controller";

/**
 * User routes module for handling user-related HTTP endpoints.
 *
 * @description This module defines the routing configuration for user operations including
 * profile management and authentication. All routes are protected by session validation middleware.
 *
 * @routes
 * - GET /me - Retrieves the current authenticated user's profile information
 * - PATCH /me - Updates the current authenticated user's profile with validation
 * - PATCH /update-password - Updates the current user's password with validation
 *
 * @middleware
 * - validateSessionMiddleware - Applied to all routes for authentication
 * - validateRequest - Applied to PATCH routes for request body validation
 *
 * @example
 * ```typescript
 * import { userRoutes } from './user.routes';
 * app.use('/api/users', userRoutes);
 * ```
 */
const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.use(validateSessionMiddleware);

userRoutes.route("/me").get(userController.getCurrentUser).patch(validateRequest({ body: updateUserSchema }), userController.updateCurrentUser);

userRoutes.route("/update-password").patch(validateRequest({ body: updatePasswordSchema }), userController.updateUserPassword);

export { userRoutes };
