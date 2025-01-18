import { Router } from "express";

import envConfig from "../../../config/env.config";

import validateRequest from "../../../middlewares/validate-request.middleware";

import { loginUserSchema } from "../schemas/login-user.schema";
import { registerUserSchema } from "../schemas/register-user.schema";
import { localAuthController } from "./local-auth.module";

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route("/register")
  .post(validateRequest({ body: registerUserSchema }), (req, res) =>
    localAuthController.register(req, res)
  );

// - POST /login: Authenticate a user (requires request body validation).
router
  .route("/login")
  .post(validateRequest({ body: loginUserSchema }), (req, res) =>
    localAuthController.login(req, res)
  );

export default router;
