import envConfig from '../../config/envConfig';

export default function sendVerificationEmailTemplate(token: string) {
  const verificationLink = `${envConfig.server.url}/api/v1/verify-email/${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
          }
          h1 {
            color: #4a4a4a;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.8em;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verify Your Email</h1>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
