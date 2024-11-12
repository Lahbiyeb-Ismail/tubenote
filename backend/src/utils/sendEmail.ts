import transporter from '../config/nodemailer.config';
import envConfig from '../config/envConfig';

/**
 * This function sends an email to the given email with the email verification link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The email verification token
 */

type SendEmailProps = {
  emailRecipient: string;
  emailSubject: string;
  emailBody: string;
};

export const sendEmail = async ({
  emailRecipient,
  emailSubject,
  emailBody,
}: SendEmailProps) => {
  // const verifyLink = `${envConfig.server.url}/api/v1/verify-email/${token}`;
  const mailOptions = {
    from: envConfig.email.from,
    to: emailRecipient,
    subject: emailSubject,
    html: emailBody,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info(`Verify email sent: ${info.response}`);
    }
  });
};
