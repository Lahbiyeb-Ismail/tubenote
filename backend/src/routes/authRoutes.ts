import { Router } from 'express';
import { handleSignup, handlelogin } from '../controllers/authControllers';
import validateRequestBody from '../middlewares/validateRequestBody';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

router
  .route('/auth/signup')
  .post(validateRequestBody(signupSchema), handleSignup);

router.route('/auth/login').post(validateRequestBody(loginSchema), handlelogin);

export default router;
