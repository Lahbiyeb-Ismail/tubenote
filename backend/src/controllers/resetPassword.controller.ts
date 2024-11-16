import type { Response } from 'express';
import httpStatus from 'http-status';

import type { TypedRequest } from '../types';
import type { ResetPasswordBody } from '../types/resetPassword.type';
import { getUser } from '../helpers/auth.helper';
import {
  createResetPasswordToken,
  getResetPasswordToken,
} from '../services/resetPassword.services';
import { sendEmail } from '../utils/sendEmail';
import { createResetPasswordEmail } from '../helpers/resetPassword.helper';

/**
 * Handles the password reset process for a user.
 *
 * This function processes a password reset request by verifying the user's email,
 * checking if a reset token has already been sent, generating a new reset token,
 * and sending a password reset email to the user.
 *
 * @param req - The HTTP request object containing the user's email in the body.
 * @param res - The HTTP response object used to send the response.
 *
 * @returns Sends an HTTP response with the status and message indicating the result of the operation.
 */
export async function handleForgotPassword(
  req: TypedRequest<ResetPasswordBody>,
  res: Response
) {
  const { email } = req.body;

  if (!email) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Email is required.' });
    return;
  }

  const user = await getUser({ email });

  if (!user || !user.emailVerified) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid email or email not verified.' });
    return;
  }

  const isResetTokenAlreadySent = await getResetPasswordToken(user.id);

  if (isResetTokenAlreadySent) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'A password reset link has already been sent to your email.',
    });
    return;
  }

  const newResetToken = await createResetPasswordToken(user.id);

  const { htmlContent, textContent } = createResetPasswordEmail(newResetToken);

  await sendEmail({
    emailSubject: 'Reset Password',
    emailRecipient: user.email,
    htmlContent,
    textContent,
  });

  res
    .status(httpStatus.OK)
    .json({ message: 'Password reset link sent to your email.' });
}
