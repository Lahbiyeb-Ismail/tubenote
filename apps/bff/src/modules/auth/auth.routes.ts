import { loginSchema, registerSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { AuthController } from "./auth.controller";

const authRoutes: Router = Router();
const authController = new AuthController();

authRoutes.route("/register").post(validateRequest({ body: registerSchema }), authController.register);
authRoutes.route("/login").post(validateRequest({ body: loginSchema }), authController.login);

authRoutes.post("/logout", validateSessionMiddleware, authController.logout);

export { authRoutes };
