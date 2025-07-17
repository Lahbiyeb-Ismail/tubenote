import { Router } from "express";

import { UserController } from "./user.controller";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.get("/me", userController.getCurrentUser);

export { userRoutes };
