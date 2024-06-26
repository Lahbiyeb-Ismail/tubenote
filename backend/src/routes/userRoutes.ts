import { Router } from 'express';

import { createNewUser, getUserById } from '../controllers/userControllers';
import validateRequestBody from '../middlewares/validateRequestBody';
import { userSchema } from '../schemas';
import checkUserExists from '../middlewares/checkUserExists';

const router = Router();

router
  .route('/users')
  .post(checkUserExists, validateRequestBody(userSchema), createNewUser);

router.route('/users/:user_id').get(getUserById);

export default router;
