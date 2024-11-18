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

  const { htmlContent, textContent, logoPath } =
    createResetPasswordEmail(newResetToken);

  await sendEmail({
    emailSubject: 'Reset Password',
    emailRecipient: user.email,
    htmlContent,
    textContent,
    logoPath,
  });

  res
    .status(httpStatus.OK)
    .json({ message: 'Password reset link sent to your email.' });
}

/**
 * Handles the password reset process.
 *
 * This function is responsible for resetting a user's password. It expects a request
 * containing the new password and a reset token. If the password is not provided,
 * it responds with a 400 Bad Request status. Otherwise, it hashes the new password,
 * updates the user's password in the database, deletes the reset token, and responds
 * with a 200 OK status indicating that the password reset was successful.
 *
 * @param req - The request object containing the new password and reset token.
 * @param res - The response object used to send the response.
 * @returns A promise that resolves when the password reset process is complete.
 */
export async function handleResetPassword(
  req: TypedRequest<ResetPasswordBody>,
  res: Response
) {
  const { password } = req.body;
  const resetToken = req.resetToken;

  if (!password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Password is required.' });
    return;
  }

  const hashedPassword = await hashPassword(password);

  await updateUser(resetToken.userId, {
    password: hashedPassword,
  });

  await deleteResetPasswordToken(resetToken.userId);

  res.status(httpStatus.OK).json({ message: 'Password reset successful.' });
}

/**
 * Handles the verification of the reset password token.
 *
 * @param _req - The request object containing the token to be verified.
 * @param res - The response object used to send the verification result.
 *
 * @returns A JSON response indicating that the token is valid.
 */
export async function handleResetPasswordTokenVerification(
  _req: TypedRequest,
  res: Response
) {
  res.status(httpStatus.OK).json({ message: 'Token is valid.' });
}
