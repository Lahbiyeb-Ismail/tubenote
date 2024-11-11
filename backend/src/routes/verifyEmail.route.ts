import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import { sendVerifyEmailSchema } from '../schemas/verifyEmail.schema';
import { sendVerificationEmailHandler } from '../controllers/verifyEmail.controller';

const router = Router();

router
  .route('/send-verification-email')
  .post(
    validateRequestBody(sendVerifyEmailSchema),
    sendVerificationEmailHandler
  );

export default router;
