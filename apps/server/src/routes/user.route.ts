import { Router } from "express";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequest from "../middlewares/validateRequest";

import userController from "../controllers/userController";

import {
  updatePasswordBodySchema,
  updateUserBodySchema,
} from "../schemas/user.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
router.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
router
  .route("/me")
  .get(userController.getCurrentUser)
  .patch(
    validateRequest({ body: updateUserBodySchema }),
    userController.updateCurrentUser
  );

// - PATCH /update-password: Update the current user's password (requires request body validation)
router
  .route("/update-password")
  .patch(
    validateRequest({ body: updatePasswordBodySchema }),
    userController.updateUserPassword
  );

export default router;
