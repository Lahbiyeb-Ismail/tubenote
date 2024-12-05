import httpStatus from "http-status";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "../types";
import type {
	SendVerifyEmailBody,
	VerifyEmailParam,
} from "../types/verifyEmail.type";

import { sendEmail } from "../utils/sendEmail";

import {
	createEmailVericationToken,
	deleteEmailVericationToken,
	findVerificationToken,
	getEmailVericationToken,
} from "../services/verifyEmail.services";
import { findUser, verifyUserEmail } from "../services/user.services";

import {
	createVerificationEmail,
	createVerifiedEmail,
} from "../helpers/verifyEmail.helper";

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
	req: TypedRequest<SendVerifyEmailBody>,
	res: Response,
): Promise<void> {
	const { email } = req.body;

	// Retrieves the user associated with the provided email.
	const user = await findUser({ email });

	// If no user is found, responds with an UNAUTHORIZED status.
	if (!user) {
		res
			.status(httpStatus.UNAUTHORIZED)
			.json({ message: "No user found with the provided email." });
		return;
	}

	// If the user's email is already verified, responds with a CONFLICT status.
	if (user.emailVerified) {
		res
			.status(httpStatus.CONFLICT)
			.json({ message: "Email is already verified." });
		return;
	}

	// Checks if a verification token already exists for the user.
	const existingVerificationToken = await getEmailVericationToken(user.id);

	// If a token exists, responds with a BAD_REQUEST status indicating that a verification email has already been sent.
	if (existingVerificationToken) {
		res.status(httpStatus.BAD_REQUEST).json({
			message:
				"A verification email has already been sent. Please check your email.",
		});
		return;
	}

	// Creates a new email verification token for the user.
	const token = await createEmailVericationToken(user.id);

	const { htmlContent, textContent, logoPath } =
		await createVerificationEmail(token);

	// Sends the verification email to the provided email address.
	await sendEmail({
		emailRecipient: email,
		emailSubject: "Verification Email",
		htmlContent,
		textContent,
		logoPath,
	});

	// Responds with an OK status indicating that the verification email has been sent.
	res.status(httpStatus.OK).json({ message: "Verification email sent." });
}

/**
 * Handles the email verification process.
 *
 * @param req - The request object containing the verification token in the parameters.
 * @param res - The response object used to send the response back to the client.
 *
 * @remarks
 * The function performs the following steps:
 * 1. Extracts the token from the request parameters.
 * 2. Checks if the token is present. If not, responds with a 400 Bad Request status.
 * 3. Finds the verification token in the database.
 * 4. Checks if the token is valid and not expired. If invalid or expired, responds with a 404 Not Found status.
 * 5. Updates the user's emailVerified status to true.
 * 6. Deletes the email verification token from the database.
 * 7. Responds with a 200 OK status indicating that the email was verified successfully.
 */
export async function verifyEmailHandler(
	req: TypedRequest<EmptyRecord, VerifyEmailParam>,
	res: Response,
): Promise<void> {
	const { token } = req.params;

	const verificationToken = await findVerificationToken(token);

	if (!verificationToken || verificationToken.expiresAt < new Date()) {
		res
			.status(httpStatus.NOT_FOUND)
			.json({ message: "Invalid or Expired token." });
		return;
	}

	// Updates the user's emailVerified status to true.
	await verifyUserEmail(verificationToken.userId);

	await deleteEmailVericationToken(verificationToken.userId);

	const { htmlContent } = await createVerifiedEmail();

	// Send HTML response with success message and client-side redirect
	res.status(httpStatus.OK).send(htmlContent);
}
