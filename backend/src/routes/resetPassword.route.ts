import { Router } from 'express';
import validateRequestBody from '../middlewares/validateRequestBody';
import {
  passwordResetBodySchema,
  passwordResetParamsSchema,
  forgotPasswordBodySchema,
} from '../schemas/resetPassword.schema';
import {
  handleForgotPassword,
  handleResetPassword,
  verifyPasswordResetToken,
} from '../controllers/resetPassword.controller';
import validateRequestParams from '../middlewares/validateRequestParams';

const router = Router();

router
  .route('/forgot-password')
  .post(validateRequestBody(forgotPasswordBodySchema), handleForgotPassword);

router
  .route('/reset-password/:token/verify')
  .get(
    validateRequestParams(passwordResetParamsSchema),
    verifyPasswordResetToken
  );

router
  .route('/reset-password/:token')
  .post(
    validateRequestParams(passwordResetParamsSchema),
    validateRequestBody(passwordResetBodySchema),
    handleResetPassword
  );

export default router;
