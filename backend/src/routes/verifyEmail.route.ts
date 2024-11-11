import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import validateRequestParams from '../middlewares/validateRequestParams';
import {
  sendVerifyEmailSchema,
  verifyEmailSchema,
} from '../schemas/verifyEmail.schema';
import {
  sendVerificationEmailHandler,
  verifyEmailHandler,
} from '../controllers/verifyEmail.controller';

const router = Router();

router
  .route('/send-verification-email')
  .post(
    validateRequestBody(sendVerifyEmailSchema),
    sendVerificationEmailHandler
  );

// /verify-email
router
  .route('/verify-email/:token')
  .get(validateRequestParams(verifyEmailSchema), verifyEmailHandler);

export default router;
