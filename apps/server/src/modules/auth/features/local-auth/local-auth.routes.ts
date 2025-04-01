import { Router } from "express";

import { createRateLimitMiddleware, validateRequest } from "@/middlewares";

import { loginSchema, registerSchema } from "@/modules/shared/schemas";

import { AUTH_RATE_LIMIT_CONFIG } from "../../config";
import { localAuthController } from "./local-auth.module";

const localAuthRoutes = Router();

const registerRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `register:ip:${req.ip}`,
  rateLimitConfig: AUTH_RATE_LIMIT_CONFIG.registration,
});

// IP-based rate limiting middleware for login
const loginRateLimiter = createRateLimitMiddleware({
  keyGenerator: (req) => `login:ip:email:${req.ip}-${req.body.email}`,
  rateLimitConfig: AUTH_RATE_LIMIT_CONFIG.login,
});

// - POST /register: Register a new user (requires request body validation).
localAuthRoutes
  .route("/register")
  .post(
    validateRequest({ body: registerSchema }),
    registerRateLimiter,
    (req, res) => localAuthController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
localAuthRoutes
  .route("/login")
  .post(validateRequest({ body: loginSchema }), loginRateLimiter, (req, res) =>
    localAuthController.login(req, res)
  );

export { localAuthRoutes };
