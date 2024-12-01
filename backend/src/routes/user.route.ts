import { Router } from 'express';

import {
  getCurrentUser,
  updateCurrentUser,
  updateUserPassword,
} from '../controllers/user.controller';

import isAuthenticated from '../middlewares/isAuthenticated';
import validateRequestBody from '../middlewares/validateRequestBody';

import { updatePasswordSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any user routes.
router.use(isAuthenticated);

// - GET /me: Get the current user's information
// - PATCH /me: Update the current user's information (requires request body validation)
router
  .route('/me')
  .get(getCurrentUser)
  .patch(validateRequestBody(updateUserSchema), updateCurrentUser);

// - PATCH /update-password: Update the current user's password (requires request body validation)
router
  .route('/update-password')
  .patch(validateRequestBody(updatePasswordSchema), updateUserPassword);

export default router;
