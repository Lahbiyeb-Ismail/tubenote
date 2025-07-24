import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { UserController } from "./user.controller";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.use(validateSessionMiddleware);

userRoutes.route("/me").get(userController.getCurrentUser).patch(userController.updateCurrentUser);

userRoutes.route("/update-password").patch(userController.updateUserPassword);

export { userRoutes };
