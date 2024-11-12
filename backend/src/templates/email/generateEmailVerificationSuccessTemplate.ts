import envConfig from '../../config/envConfig';

export function generateEmailVerificationSuccessTemplate() {
  const loginRedirectUrl = `${envConfig.client.url}/login`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified Successfully</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background-color: #f0f2f5;
          }
          .container { 
            text-align: center; 
            padding: 2rem; 
            border-radius: 8px; 
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
          }
          .success { color: #2ecc71; }
          #countdown { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">Email Verified Successfully!</h1>
          <p>Thank you for verifying your email address.</p>
          <p><a href="${loginRedirectUrl}">click here to redirect to the login page.</a></p>
        </div>
      </body>
    </html>
  `;
}
