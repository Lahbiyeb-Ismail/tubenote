import { loginSchema, registerSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { AuthController } from "./auth.controller";

/**
 * Authentication routes module that handles user registration, login, and logout operations.
 *
 * This module provides the following endpoints:
 * - POST /register - Creates a new user account with validation
 * - POST /login - Authenticates existing users
 * - POST /logout - Terminates user session (requires authentication)
 *
 * All routes include appropriate middleware for request validation and session management.
 *
 * @module AuthRoutes
 * @requires express.Router
 * @requires @tubenote/schemas - For request validation schemas
 * @requires AuthController - For handling authentication business logic
 * @requires validateRequest - Middleware for request body validation
 * @requires validateSessionMiddleware - Middleware for session authentication
 */
const authRoutes: Router = Router();
const authController = new AuthController();

authRoutes.route("/register").post(validateRequest({ body: registerSchema }), authController.register);
authRoutes.route("/login").post(validateRequest({ body: loginSchema }), authController.login);

authRoutes.post("/logout", validateSessionMiddleware, authController.logout);

export { authRoutes };
