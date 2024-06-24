import { Router } from 'express';
import { handleSignup } from '../controllers/authControllers';
import validateRequestData from '../middlewares/validateRequestData';
import { signupSchema } from '../schemas';

const router = Router();

router
  .route('/auth/signup')
  .post(validateRequestData(signupSchema), handleSignup);

export default router;
