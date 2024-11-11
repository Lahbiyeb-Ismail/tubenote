import httpStatus from 'http-status';
import type { Response } from 'express';

import type { TypedRequest } from '../types';
import { getUser } from '../helpers/auth.helper';
import type { SendVerifyEmail } from '../types/verifyEmail.type';
import { sendVerifyEmail } from '../utils/sendEmail';
import {
  createEmailVericationToken,
  getEmailVericationToken,
} from '../services/verifyEmail.services';

/**
 * Handles the request to send a verification email.
 *
 * @param req - The request object containing the email to verify.
 * @param res - The response object used to send back the appropriate response.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Extracts the email from the request body.
 * 2. Checks if the email is provided; if not, responds with a BAD_REQUEST status.
 * 3. Retrieves the user associated with the provided email.
 * 4. If no user is found, responds with an UNAUTHORIZED status.
 * 5. If the user's email is already verified, responds with a CONFLICT status.
 * 6. Checks if a verification token already exists for the user.
 * 7. If a token exists, responds with a BAD_REQUEST status indicating that a verification email has already been sent.
 * 8. Creates a new email verification token for the user.
 * 9. Sends the verification email to the provided email address.
 * 10. Responds with an OK status indicating that the verification email has been sent.
 */
export async function sendVerificationEmailHandler(
  req: TypedRequest<SendVerifyEmail>,
  res: Response
) {
  const { email } = req.body;

  // Checks if the email is provided; if not, responds with a BAD_REQUEST status.
  if (!email) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Email is required.' });
    return;
  }

  // Retrieves the user associated with the provided email.
  const user = await getUser({ email });

  // If no user is found, responds with an UNAUTHORIZED status.
  if (!user) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'No user found with the provided email.' });
    return;
  }

  // If the user's email is already verified, responds with a CONFLICT status.
  if (user.emailVerified) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: 'Email is already verified.' });
    return;
  }

  // Checks if a verification token already exists for the user.
  const existingVerificationToken = await getEmailVericationToken(user.id);

  // If a token exists, responds with a BAD_REQUEST status indicating that a verification email has already been sent.
  if (existingVerificationToken) {
    res.status(httpStatus.BAD_REQUEST).json({
      message:
        'A verification email has already been sent. Please check your email.',
    });
    return;
  }

  // Creates a new email verification token for the user.
  const token = await createEmailVericationToken(user.id);

  // Sends the verification email to the provided email address.
  await sendVerifyEmail(email, token);

  // Responds with an OK status indicating that the verification email has been sent.
  res.status(httpStatus.OK).json({ message: 'Verification email sent.' });
}
