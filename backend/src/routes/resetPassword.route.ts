import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import { sendResetPasswordEmailSchema } from '../schemas/resetPassword.schema';
import { handleForgotPassword } from '../controllers/resetPassword.controller';

const router = Router();

router
  .route('/forgot-password')
  .post(
    validateRequestBody(sendResetPasswordEmailSchema),
    handleForgotPassword
  );

export default router;
