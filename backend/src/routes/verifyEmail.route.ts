import { Router } from 'express';

import {
  sendVerificationEmailHandler,
  verifyEmailHandler,
} from '../controllers/verifyEmail.controller';

import validateRequestBody from '../middlewares/validateRequestBody';
import validateRequestParams from '../middlewares/validateRequestParams';

import {
  sendVerifyEmailSchema,
  verifyEmailSchema,
} from '../schemas/verifyEmail.schema';

const router = Router();

// - POST /send-verification-email: Send a verification email to the user (requires request body validation)
router
  .route('/send-verification-email')
  .post(
    validateRequestBody(sendVerifyEmailSchema),
    sendVerificationEmailHandler
  );

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
router
  .route('/verify-email/:token')
  .get(validateRequestParams(verifyEmailSchema), verifyEmailHandler);

export default router;
