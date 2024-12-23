import envConfig from "../config/envConfig";
import transporter from "../config/nodemailer.config";

/**
 * This function sends an email to the given email with the email verification link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The email verification token
 */

type SendEmailProps = {
  emailRecipient: string;
  emailSubject: string;
  htmlContent: string;
  textContent: string;
  logoPath: string;
};

export async function sendEmail({
  emailRecipient,
  emailSubject,
  htmlContent,
  textContent,
  logoPath,
}: SendEmailProps) {
  const mailOptions = {
    from: envConfig.email.from,
    to: emailRecipient,
    subject: emailSubject,
    html: htmlContent,
    text: textContent,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo",
      },
    ],
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info(`Verify email sent: ${info.response}`);
    }
  });
}
