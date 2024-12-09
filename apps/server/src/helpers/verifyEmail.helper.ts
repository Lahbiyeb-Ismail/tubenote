import type { EmailContent } from "src/types/email.type";
import envConfig from "../config/envConfig";
import compileTemplate from "../utils/compileTemplate";

/**
 * Creates the content for a verification email.
 *
 * @param token - The token to be included in the verification link.
 * @returns A promise that resolves to the email content.
 */
export async function createVerificationEmail(
  token: string
): Promise<EmailContent> {
  const verificationLink = `${envConfig.server.url}/api/v1/verify-email/${token}`;
  return compileTemplate("verification-email", { verificationLink });
}

/**
 * Creates the content for a verified email.
 *
 * This function generates a login link using the client URL from the environment configuration
 * and compiles an email template named 'email-verified' with the login link.
 *
 * @returns {Promise<EmailContent>} A promise that resolves to the compiled email content.
 */
export async function createVerifiedEmail(): Promise<EmailContent> {
  const loginLink = `${envConfig.client.url}/login`;
  return compileTemplate("email-verified", { loginLink });
}
