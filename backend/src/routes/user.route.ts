import { Router } from 'express';

import {
  updateCurrentUser,
  updateUserPassword,
} from '../controllers/user.controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import validateRequestBody from '../middlewares/validateRequestBody';
import { updatePasswordSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

router
  .route('/update-current')
  .patch(
    isAuthenticated,
    validateRequestBody(updateUserSchema),
    updateCurrentUser
  );

router
  .route('/update-password')
  .patch(
    isAuthenticated,
    validateRequestBody(updatePasswordSchema),
    updateUserPassword
  );

export default router;
