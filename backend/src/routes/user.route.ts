import { Router } from 'express';

import { updateCurrentUser } from '../controllers/user.controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import validateRequestBody from '../middlewares/validateRequestBody';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

router
  .route('/update-current')
  .patch(
    isAuthenticated,
    validateRequestBody(updateUserSchema),
    updateCurrentUser
  );

export default router;
