import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { UserController } from "./user.controller";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.get("/me", validateSessionMiddleware, userController.getCurrentUser);

export { userRoutes };
