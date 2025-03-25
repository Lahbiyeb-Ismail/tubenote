import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";

import { updatePasswordSchema, updateUserSchema } from "./schemas";
import { userController } from "./user.module";

const userRoutes = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
userRoutes.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
userRoutes
  .route("/me")
  .get((req, res) => userController.getCurrentUser(req, res))
  .patch(validateRequest({ body: updateUserSchema }), (req, res) =>
    userController.updateCurrentUser(req, res)
  );

// - PATCH /update-password: Update the current user's password (requires request body validation)
userRoutes
  .route("/update-password")
  .patch(validateRequest({ body: updatePasswordSchema }), (req, res) =>
    userController.updatePassword(req, res)
  );

export { userRoutes };
