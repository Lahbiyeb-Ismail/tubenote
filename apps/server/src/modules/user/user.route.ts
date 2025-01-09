import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import prismaClient from "../../lib/prisma";
import { PasswordService } from "../password/password.service";
import { updatePasswordSchema } from "./schema/update-password.schema";
import { updateUserSchema } from "./schema/update-user.schema";
import { UserController } from "./user.controller";
import { UserDatabase } from "./user.db";
import { UserService } from "./user.service";

const userDB = new UserDatabase(prismaClient);
const passwordService = new PasswordService(userDB);

const userService = new UserService(userDB, passwordService);
const userController = new UserController(userService);

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
router.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
router
  .route("/me")
  .get((req, res) => userController.getCurrentUser(req, res))
  .patch(validateRequest({ body: updateUserSchema }), (req, res) =>
    userController.updateCurrentUser(req, res)
  );

// - PATCH /update-password: Update the current user's password (requires request body validation)
// router
//   .route("/update-password")
//   .patch(validateRequest({ body: updatePasswordSchema }), (req, res) =>
//     userController.updateUserPassword(req, res)
//   );

export default router;
