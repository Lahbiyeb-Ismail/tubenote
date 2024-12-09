import envConfig from "../config/envConfig";
import type { EmailContent } from "../types/email.type";
import compileTemplate from "../utils/compileTemplate";

/**
 * Creates the content for a reset password email.
 *
 * @param token - The token to be included in the reset password link.
 * @returns A promise that resolves to the email content.
 */
export function createResetPasswordEmail(token: string): Promise<EmailContent> {
  const resetLink = `${envConfig.client.url}/password-reset/${token}/`;

  return compileTemplate("reset-password", { resetLink });
}
