import { Router } from 'express';

import {
  handleForgotPassword,
  handleResetPassword,
  handleResetPasswordTokenVerification,
} from '../controllers/resetPassword.controller';

import validateRequestBody from '../middlewares/validateRequestBody';
import validateRequestParams from '../middlewares/validateRequestParams';
import { verifyPasswordResetToken } from '../middlewares/verifyPasswordResetToken';

import {
  passwordResetBodySchema,
  passwordResetParamsSchema,
  forgotPasswordBodySchema,
} from '../schemas/resetPassword.schema';

const router = Router();

// - POST /forgot-password: Initiate the password reset process (requires request body validation).
router
  .route('/forgot-password')
  .post(validateRequestBody(forgotPasswordBodySchema), handleForgotPassword);

// Apply verifyPasswordResetToken middleware to all routes below
router.use(verifyPasswordResetToken);

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
router
  .route('/reset-password/:token/verify')
  .get(
    validateRequestParams(passwordResetParamsSchema),
    handleResetPasswordTokenVerification
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
router
  .route('/reset-password/:token')
  .post(
    validateRequestParams(passwordResetParamsSchema),
    validateRequestBody(passwordResetBodySchema),
    handleResetPassword
  );

export default router;
