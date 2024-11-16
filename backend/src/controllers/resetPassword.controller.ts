import type { Response } from 'express';
import httpStatus from 'http-status';

import type { TypedRequest } from '../types';
import type {
  ForgotPasswordBody,
  ResetPasswordBody,
} from '../types/resetPassword.type';
import { getUser } from '../helpers/auth.helper';
import {
  createResetPasswordToken,
  deleteResetPasswordToken,
  findResetPasswordToken,
} from '../services/resetPassword.services';
import { sendEmail } from '../utils/sendEmail';
import { createResetPasswordEmail } from '../helpers/resetPassword.helper';
import { hashPassword } from '../services/auth.services';
import { updateUser } from '../services/user.services';

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
  req: TypedRequest<ForgotPasswordBody>,
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

  const isResetTokenAlreadySent = await findResetPasswordToken({
    userId: user.id,
  });

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

/**
 * Handles the password reset process.
 *
 * @param req - The request object containing the reset token and new password.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * The function performs the following steps:
 * 1. Validates the presence of the reset token and new password in the request.
 * 2. Checks if the provided reset token is valid and not expired.
 * 3. Hashes the new password.
 * 4. Updates the user's password in the database.
 * 5. Deletes the used reset token from the database.
 * 6. Sends a success response if the password reset is successful.
 *
 * @throws Will send a 400 Bad Request response if the token or password is missing or invalid.
 */
export async function handleResetPassword(
  req: TypedRequest<ResetPasswordBody>,
  res: Response
) {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Token is required.' });
    return;
  }

  if (!password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Password is required.' });
    return;
  }

  const resetToken = await findResetPasswordToken({ token });

  if (!resetToken) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid or expired token.' });
    return;
  }

  const hashedPassword = await hashPassword(password);

  await updateUser(resetToken.userId, {
    password: hashedPassword,
  });

  await deleteResetPasswordToken(resetToken.userId);

  res.status(httpStatus.OK).json({ message: 'Password reset successful.' });
}
