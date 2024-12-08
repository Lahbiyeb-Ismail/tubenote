import httpStatus from "http-status";

import type { Request, Response } from "express";
import type { Profile } from "passport-google-oauth20";

import { REFRESH_TOKEN_NAME, REFRESH_TOKEN_SECRET } from "../constants/auth";

import type { JwtPayload, TypedRequest } from "../types";
import type {
	GoogleUser,
	LoginCredentials,
	RegisterCredentials,
} from "../types/auth.type";

import {
	clearRefreshTokenCookieConfig,
	refreshTokenCookieConfig,
} from "../config/cookie.config";
import envConfig from "../config/envConfig";

import { sendEmail } from "../utils/sendEmail";

import {
	checkPassword,
	createNewTokens,
	verifyToken,
} from "../helpers/auth.helper";
import { createVerificationEmail } from "../helpers/verifyEmail.helper";

import { createEmailVericationToken } from "../services/verifyEmail.services";
import { findUser, updateUser } from "../services/user.services";
import { createNewUser } from "../services/auth.services";
import {
	deleteRefreshToken,
	deleteRefreshTokenByUserId,
	findRefreshToken,
} from "../services/refreshToken.services";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../errors";

/**
 * Handles user registration.
 *
 * This function processes the registration request by validating the input fields,
 * checking if the user already exists, and creating a new user if the email is not in use.
 * It sends appropriate HTTP responses based on the outcome of these operations.
 *
 * @param req - The HTTP request object, containing the user registration details in the body.
 * @param res - The HTTP response object, used to send back the appropriate response.
 *
 * @returns A promise that resolves to void.
 *
 * @throws Will send a 400 status code if any of the required fields (username, email, password) are missing.
 * @throws Will send a 409 status code if the email address is already in use.
 * @throws Will send a 500 status code if there is an internal server error.
 */
export async function handleRegister(
	req: TypedRequest<RegisterCredentials>,
	res: Response,
): Promise<void> {
	const { username, email, password } = req.body;

	const user = await findUser({ email });

	if (user) {
		throw new ConflictError(
			"Email address already in use. Please select another one.",
		);
	}

	const newUser = await createNewUser({
		username,
		email,
		password,
		emailVerified: false,
	});

	// Creates a new email verification token for the user.
	const token = await createEmailVericationToken(newUser.id);

	const { htmlContent, textContent, logoPath } =
		await createVerificationEmail(token);

	await sendEmail({
		emailRecipient: newUser.email,
		emailSubject: "Email Verification",
		htmlContent,
		textContent,
		logoPath,
	});

	res.status(httpStatus.CREATED).json({
		message: "A verification email has been sent to your email.",
		email: newUser.email,
	});
}

/**
 * Handles the login process for a user.
 *
 * @param req - The request object containing the user's email and password.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Extracts the email and password from the request body.
 * 2. Checks if a user with the provided email exists.
 * 3. If the user does not exist, responds with a 404 status and an appropriate message.
 * 4. If the user exists, checks if the provided password is correct.
 * 5. If the password is incorrect, responds with a 401 status and an appropriate message.
 * 6. If the password is correct, creates and saves new tokens for the user.
 * 7. Responds with a 200 status, a success message, the access token, and user details.
 *
 * @throws Will respond with a 500 status and an "Internal Server Error" message if an error occurs during the process.
 */
export async function handleLogin(
	req: TypedRequest<LoginCredentials>,
	res: Response,
): Promise<void> {
	const { email, password } = req.body;

	const user = await findUser({ email });

	if (!user) {
		throw new NotFoundError("No User found with this email address.");
	}

	if (!user.emailVerified) {
		throw new UnauthorizedError(
			"Email not verified. Please verify your email address.",
		);
	}

	const isPasswordCorrect = await checkPassword(password, user.password);

	if (!isPasswordCorrect) {
		throw new UnauthorizedError("Invalid password. Please try again.");
	}

	const { accessToken, refreshToken } = await createNewTokens(user.id);

	res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

	res.status(httpStatus.OK).json({
		message: "Login successful",
		accessToken,
	});
}

/**
 * Handles Google login by processing the user profile received from Google,
 * verifying the email, and creating or updating the user in the database.
 * If the login is successful, it generates and saves new tokens and redirects
 * the user to the client callback URL with the access token.
 *
 * @param req - The request object containing the user profile from Google.
 * @param res - The response object used to send the response.
 *
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
export async function handleGoogleLogin(
	req: TypedRequest,
	res: Response,
): Promise<void> {
	const user = req.user as Profile;

	if (!user) {
		throw new UnauthorizedError("Google login failed. Please try again.");
	}

	const {
		sub: googleId,
		email,
		email_verified,
		name,
		picture,
	} = user._json as GoogleUser;

	if (!email_verified) {
		throw new UnauthorizedError("Email not verified. Please try again.");
	}

	let foundUser = await findUser({ email });

	if (!foundUser) {
		foundUser = await createNewUser({
			username: name,
			emailVerified: email_verified,
			password: googleId,
			profilePicture: picture,
			email,
			googleId,
		});
	} else if (!foundUser.googleId) {
		foundUser = await updateUser({ userId: foundUser.id, data: { googleId } });
	}

	const { accessToken, refreshToken } = await createNewTokens(foundUser.id);

	res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

	res.redirect(
		`${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`,
	);
}

/**
 * Handles the logout process by clearing the refresh token cookie
 * and removing the token from the database.
 *
 * @param req - The request object containing the cookies.
 * @param res - The response object used to send the status and clear the cookie.
 *
 * The function performs the following steps:
 * 1. Retrieves the refresh token from the cookies.
 * 2. If the refresh token is not present in the cookies, sends a NO_CONTENT status.
 * 3. Checks if the refresh token exists in the database.
 * 4. If the refresh token does not exist in the database, clears the cookie
 * and sends a NO_CONTENT status.
 * 5. Deletes the refresh token from the database.
 * 6. Clears the refresh token cookie.
 * 7. Sends a NO_CONTENT status.
 *
 * If an error occurs during the process, sends an INTERNAL_SERVER_ERROR
 * status with an error message.
 */
export async function handleLogout(req: Request, res: Response): Promise<void> {
	const cookies = req.cookies;

	const refreshTokenFromCookies = cookies[REFRESH_TOKEN_NAME];

	if (!refreshTokenFromCookies) {
		res.sendStatus(httpStatus.NO_CONTENT);
		return;
	}

	// Is refreshToken in db?
	const refreshTokenFromDB = await findRefreshToken(refreshTokenFromCookies);

	if (!refreshTokenFromDB) {
		res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);
		res.sendStatus(httpStatus.NO_CONTENT);
		return;
	}

	// Delete refreshToken in db
	await deleteRefreshToken(refreshTokenFromCookies);

	res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

	res.sendStatus(httpStatus.NO_CONTENT);
}

/**
 * Handles the refresh token process for authentication.
 *
 * This function performs the following steps:
 * 1. Retrieves the refresh token from the request cookies.
 * 2. If the refresh token is not present, responds with an unauthorized status.
 * 3. Clears the refresh token cookie.
 * 4. Checks if the refresh token exists in the database.
 * 5. If the refresh token is not found in the database, verifies the token and deletes all tokens for the user if the token is valid.
 * 6. Deletes the refresh token from the database.
 * 7. Verifies the refresh token and creates new access and refresh tokens if valid.
 * 8. Sets the new refresh token in the response cookies and returns the new access token.
 *
 * @param req - The request object containing the cookies.
 * @param res - The response object used to send the response.
 * @returns A promise that resolves to void.
 */
export async function handleRefreshToken(
	req: Request,
	res: Response,
): Promise<void> {
	const cookies = req.cookies;

	const refreshTokenFromCookies: string | undefined =
		cookies[REFRESH_TOKEN_NAME];

	if (!refreshTokenFromCookies) {
		throw new UnauthorizedError("Unauthorized access. Please try again.");
	}

	res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

	const payload = await verifyToken(
		refreshTokenFromCookies,
		REFRESH_TOKEN_SECRET,
	);

	const { userId, exp } = payload as JwtPayload;

	// Check if the token is expired
	if (exp && Date.now() >= exp * 1000) {
		await deleteRefreshTokenByUserId(userId);

		throw new UnauthorizedError("Refresh token expired. Please log in again.");
	}

	const refreshTokenFromDB = await findRefreshToken(refreshTokenFromCookies);

	// Detected refresh token reuse!
	if (!refreshTokenFromDB) {
		await deleteRefreshTokenByUserId(userId);

		throw new ForbiddenError("Invalid refresh token. Please log in again.");
	}

	await deleteRefreshToken(refreshTokenFromCookies);

	if (refreshTokenFromDB.userId !== userId) {
		res.sendStatus(httpStatus.FORBIDDEN);
		return;
	}

	const { accessToken, refreshToken } = await createNewTokens(userId);

	res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

	res.json({ accessToken });
}
