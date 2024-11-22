import { Router } from 'express';

import {
  passwordResetBodySchema,
  passwordResetParamsSchema,
  forgotPasswordBodySchema,
} from '../schemas/resetPassword.schema';

import {
  handleForgotPassword,
  handleResetPassword,
  handleResetPasswordTokenVerification,
} from '../controllers/resetPassword.controller';

import validateRequestBody from '../middlewares/validateRequestBody';
import validateRequestParams from '../middlewares/validateRequestParams';
import { verifyPasswordResetToken } from '../middlewares/verifyPasswordResetToken';

const router = Router();

router
  .route('/forgot-password')
  .post(validateRequestBody(forgotPasswordBodySchema), handleForgotPassword);

router
  .route('/reset-password/:token/verify')
  .get(
    validateRequestParams(passwordResetParamsSchema),
    verifyPasswordResetToken,
    handleResetPasswordTokenVerification
  );

router
  .route('/reset-password/:token')
  .post(
    validateRequestParams(passwordResetParamsSchema),
    validateRequestBody(passwordResetBodySchema),
    verifyPasswordResetToken,
    handleResetPassword
  );

export default router;
