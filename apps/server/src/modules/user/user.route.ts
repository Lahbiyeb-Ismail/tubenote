import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import { updatePasswordSchema } from "./schema/update-password.schema";
import { updateUserSchema } from "./schema/update-user.schema";
import UserController from "./user.controller";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
router.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
router
  .route("/me")
  .get(UserController.getCurrentUser)
  .patch(
    validateRequest({ body: updateUserSchema }),
    UserController.updateCurrentUser
  );

// - PATCH /update-password: Update the current user's password (requires request body validation)
router
  .route("/update-password")
  .patch(
    validateRequest({ body: updatePasswordSchema }),
    UserController.updateUserPassword
  );

export default router;
