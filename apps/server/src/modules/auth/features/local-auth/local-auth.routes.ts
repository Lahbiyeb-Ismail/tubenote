import { Router } from "express";

import { validateRequest } from "@/middlewares";

import { loginSchema, registerSchema } from "@/modules/shared/schemas";

import { localAuthController } from "./local-auth.module";

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registerSchema }), (req, res) =>
    localAuthController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginSchema }), (req, res) =>
    localAuthController.login(req, res)
  );

export default router;
