import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import { resetPasswordSchema } from '../schemas/resetPassword.schema';
import { resetPasswordHandler } from '../controllers/resetPassword.controller';

const router = Router();

router
  .route('/reset-password')
  .post(validateRequestBody(resetPasswordSchema), resetPasswordHandler);

export default router;
