import { updatePasswordSchema, updateUserSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { UserController } from "./user.controller";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.use(validateSessionMiddleware);

userRoutes.route("/me").get(userController.getCurrentUser).patch(validateRequest({ body: updateUserSchema }), userController.updateCurrentUser);

userRoutes.route("/update-password").patch(validateRequest({ body: updatePasswordSchema }), userController.updateUserPassword);

export { userRoutes };
