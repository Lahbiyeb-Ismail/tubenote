import { Router } from 'express';
import { handleSignup, handleLogin } from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

router
  .route('/auth/signup')
  .post(validateRequestBody(signupSchema), handleSignup);

router.route('/auth/login').post(validateRequestBody(loginSchema), handleLogin);

export default router;
