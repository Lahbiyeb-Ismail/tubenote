import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { AuthController } from "./auth.controller";

const authRoutes: Router = Router();
const authController = new AuthController();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", validateSessionMiddleware, authController.logout);

export { authRoutes };
