import { Router } from "express";

import { validateRequest } from "@/middlewares";

import { loginSchema, registerSchema } from "@/modules/shared/schemas";

import { createRateLimitMiddleware } from "@/middlewares/rate-limit.middleware";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { loggerService, rateLimitService } from "@/modules/shared/services";
import { AUTH_RATE_LIMIT_CONFIG } from "../../config";
import { localAuthController } from "./local-auth.module";

const localAuthRoutes = Router();

// IP-based rate limiting middleware for login
const loginRateLimiter = createRateLimitMiddleware({
  rateLimitService,
  logger: loggerService,
  keyGenerator: (req) => `login:ip:email:${req.ip}-${req.body.email}`,
  limits: AUTH_RATE_LIMIT_CONFIG.login,
  errorMessage: ERROR_MESSAGES.TOO_MANY_ATTEMPTS,
});

// - POST /register: Register a new user (requires request body validation).
localAuthRoutes
  .route("/register")
  .post(validateRequest({ body: registerSchema }), (req, res) =>
    localAuthController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
localAuthRoutes
  .route("/login")
  .post(validateRequest({ body: loginSchema }), loginRateLimiter, (req, res) =>
    localAuthController.login(req, res)
  );

export { localAuthRoutes };
