import { Router } from 'express';
import { handleRegister } from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { registrationSchema } from '..//schemas/auth.schema';

const router = Router();

router
  .route('/register')
  .post(validateRequestBody(registrationSchema), handleRegister);

export default router;
