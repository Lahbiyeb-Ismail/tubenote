import { Router } from 'express';
import { handleRegister, handleLogin } from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { registrationSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router
  .route('/register')
  .post(validateRequestBody(registrationSchema), handleRegister);

router.route('/login').post(validateRequestBody(loginSchema), handleLogin);

export default router;
