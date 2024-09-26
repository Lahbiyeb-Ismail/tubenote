import { Router } from 'express';
import {
  handleSignup,
  handleLogin,
  handleLogout,
} from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

router
  .route('/auth/signup')
  .post(validateRequestBody(signupSchema), handleSignup);

router.route('/auth/login').post(validateRequestBody(loginSchema), handleLogin);

router.route('/auth/logout').post(handleLogout);

export default router;
