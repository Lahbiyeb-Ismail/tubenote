import { Router } from "express";

import {
  getCurrentUser,
  updateCurrentUser,
  updateUserPassword,
} from "../controllers/user.controller";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequest from "../middlewares/validateRequest";

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
  .get(getCurrentUser)
  .patch(validateRequest({ body: updateUserBodySchema }), updateCurrentUser);

// - PATCH /update-password: Update the current user's password (requires request body validation)
router
  .route("/update-password")
  .patch(
    validateRequest({ body: updatePasswordBodySchema }),
    updateUserPassword
  );

export default router;
