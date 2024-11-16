import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import { sendResetPasswordEmailSchema } from '../schemas/resetPassword.schema';
import { sendResetPasswordEmailHandler } from '../controllers/resetPassword.controller';

const router = Router();

router
  .route('/reset-password')
  .post(
    validateRequestBody(sendResetPasswordEmailSchema),
    sendResetPasswordEmailHandler
  );

export default router;
