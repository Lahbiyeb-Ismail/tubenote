import { Router } from "express";

import { AuthController } from "./auth.controller";

const authRoutes: Router = Router();
const authController = new AuthController();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);

export { authRoutes };
